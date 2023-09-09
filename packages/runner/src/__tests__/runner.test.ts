import {expect, jest, describe, it} from "@jest/globals";

import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

jest.unstable_mockModule("node:process", () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return {
    cwd: (): string => resolve(currentDir, "../__fixtures__"),
  };
});

jest.unstable_mockModule("../Logger.js", async() => {
  const mock = await import("../__mocks__/Logger.js");
  return mock;
});

const Logger = await import("../Logger.js");

describe("runner", () => {
  it("should load configuration form runner.config.js", async() => {
    await import("../runner.js");

    expect(Logger.default.calls).toMatchSnapshot();
  });
});