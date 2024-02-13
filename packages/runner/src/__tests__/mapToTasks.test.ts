import {expect, describe, it, vi} from "vitest";
import register from "../register.js";
import mapToTasks from "../mapToTasks.js";

describe("mapToTasks", () => {
  it("should map to registered tasks", () => {
    const task1 = vi.fn();
    const task2 = vi.fn();
    register.set("test1", task1);
    register.set("test2", task2);

    const result = mapToTasks(["test1", "test2"]);
    expect(result).toEqual([task1, task2]);
  });

  it("should throw if task is not registered", () => {
    expect(() => mapToTasks(["test-missing1", "test-missing2"]))
      .toThrowError(new Error("Missing tasks definition for: test-missing1"));
  });
});