import { expect, describe, it, vi } from "vitest";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

vi.mock("node:process", () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));

  return {
    cwd: (): string => resolve(currentDir, "../__fixtures__"),
    argv: [
      "node",
      "runner",
      "test",
    ],
  };
});

vi.mock("../Logger.js", async () => {
  const mock = await import("../__mocks__/Logger.js");
  return mock;
});

const Logger = await import("../Logger.js");

describe("runner", () => {
  it("should load configuration from runner.config.js", async () => {
    await import("../runner.js");
    await vi.dynamicImportSettled();
    expect(Logger.default.calls).toMatchSnapshot();
  });
});
