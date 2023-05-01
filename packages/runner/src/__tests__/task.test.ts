import {expect, jest, describe, it} from '@jest/globals';
import register from "../register.js";

jest.unstable_mockModule("../Logger.js", async () => {
  return await import("../__mocks__/Logger.js");
});

const {task} = await import("../task.js");

describe("task", () => {
  it("should register new task", () => {
    const ls = jest.fn();
    task("ls",  ls);

    expect(register.get("ls")).toBeInstanceOf(Function);
  });

  it("should execute task function when run", async() => {
    const ls = jest.fn();
    task("ls",  ls);  
    
    const run = register.get("ls");
    await run?.();

    expect(ls).toHaveBeenCalled();
  });
});