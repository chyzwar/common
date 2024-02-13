import {expect, describe, it, vi} from "vitest";
import register from "../register.js";

vi.mock("node:child_process", () => {
  return {
    spawn: vi.fn().mockImplementation(() => {
      const handlers: Record<string, (arg: unknown) => void> = {};
      
      const timeout = 10;
      setTimeout(() => {
        handlers.close(0);
      }, timeout);
  
      return {
        stdout: {
          on: vi.fn(),
        },
        stderr: {
          on: vi.fn(),
        },
        on: vi.fn((name: string, handler: (arg: unknown) => void) => {
          handlers[name] = handler;
        }),
      };
    }),
  };
});

vi.mock("../Logger.js", async() => {
  return import("../__mocks__/Logger.js");
});

const {dockerTask} = await import("../dockerTask.js");
const {spawn} = await import("node:child_process");

describe("dockerTask", () => {  
  it("should register new task", () => {
    dockerTask("hello", "hello-world");

    expect(register.get("hello")).toBeInstanceOf(Function);
  });

  it("should append --rm if rm:true", async() => {
    dockerTask("hello", "hello-world", {
      rm: true,
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "--rm", "hello-world"], {"shell": true});
  });

  it("should append --interactive if interactive:true", async() => {
    dockerTask("hello", "hello-world", {
      interactive: true,
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "--interactive", "hello-world"], {"shell": true});
  });

  it("should append --name if name is provided", async() => {
    dockerTask("hello", "hello-world", {
      name: "MyHello",
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "--name MyHello", "hello-world"], {"shell": true});
  });

  it("should append env variables", async() => {
    dockerTask("hello", "hello-world", {
      env: {
        test1: "test-value1",
        test2: undefined,
        test3: "test-value3",
      },
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "-e test1=test-value1", "-e test3=test-value3", "hello-world"], {"shell": true});
  });

  it("should append ports variables", async() => {
    dockerTask("hello", "hello-world", {
      ports: [
        "3000:3000", 
        "3001:3001",
      ],
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "-p 3000:3000", "-p 3001:3001", "hello-world"], {"shell": true});
  });

  it("should append volumes variables", async() => {
    dockerTask("hello", "hello-world", {
      volumes: [
        "./Caddyfile:/etc/caddy/Caddyfile", 
      ],
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "-v ./Caddyfile:/etc/caddy/Caddyfile", "hello-world"], {"shell": true});
  });
  
  it("should support network option", async() => {
    dockerTask("hello", "hello-world", {
      network: "host",
    });
    await register.get("hello")?.();

    expect(spawn).toHaveBeenCalledWith("docker", ["run", "--network=host", "hello-world"], {"shell": true});
  });
});