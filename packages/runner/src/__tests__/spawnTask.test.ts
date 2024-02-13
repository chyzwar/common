import {expect, describe, it, vi} from "vitest";

import register from "../register.js";
import SpawnError from "../SpawnError.js";

vi.mock("../Logger.js", async() => {
  return import("../__mocks__/Logger.js");
});

const {spawnTask} = await import("../spawnTask.js");

describe("spawnTask", () => {
  it("should register new task", () => {
    spawnTask("ls", "ls", ["-la"]);

    expect(register.get("ls")).toBeInstanceOf(Function);
  });

  it("should handle ENOENT", async() => {
    spawnTask("invalid", "invalid");

    const task = register.get("invalid");
    
    await expect(task?.()).rejects.toThrowError(
      new SpawnError("Spawn Task closed with non-zero exit code", -2, "invalid")
    );
  });
});