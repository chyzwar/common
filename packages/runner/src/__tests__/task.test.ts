import { expect, describe, it, vi } from "vitest";
import register from "../register.js";

vi.mock("../Logger.js", async () => {
  return import("../__mocks__/Logger.js");
});

const { task } = await import("../task.js");

describe("task", () => {
  it("should register new task", () => {
    const ls = vi.fn();
    task("ls", ls);

    expect(register.get("ls")).toBeInstanceOf(Function);
  });

  it("should execute task function when run", async () => {
    const ls = vi.fn();
    task("ls", ls);

    const run = register.get("ls");
    await run?.();

    expect(ls).toHaveBeenCalled();
  });
});
