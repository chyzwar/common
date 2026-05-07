import { expect, describe, it, vi, beforeEach } from "vitest";
import register from "../register.js";

interface SpawnedProc {
  args: string[];
  opts: Record<string, unknown> | undefined;
  handlers: Record<string, (arg: unknown) => void>;
  kill: ReturnType<typeof vi.fn>;
  unref: ReturnType<typeof vi.fn>;
  killed: boolean;
}

const spawned: SpawnedProc[] = [];

vi.mock("node:child_process", () => {
  return {
    spawn: vi.fn((_cmd: string, args: string[], opts?: Record<string, unknown>) => {
      const handlers: Record<string, (arg: unknown) => void> = {};
      const proc: SpawnedProc = {
        args,
        opts,
        handlers,
        kill: vi.fn(),
        unref: vi.fn(),
        killed: false,
      };
      spawned.push(proc);
      return {
        stdout: { on: vi.fn(), pipe: vi.fn() },
        stderr: { on: vi.fn(), pipe: vi.fn() },
        on: vi.fn((name: string, handler: (arg: unknown) => void) => {
          handlers[name] = handler;
        }),
        kill: proc.kill,
        unref: proc.unref,
        get killed() {
          return proc.killed;
        },
      };
    }),
  };
});

vi.mock("../Logger.js", async () => {
  return import("../__mocks__/Logger.js");
});

const sigHandlers: Record<string, ((...args: unknown[]) => void)[]> = {};
vi.spyOn(process, "on").mockImplementation(
  ((event: string, handler: (...args: unknown[]) => void) => {
    sigHandlers[event] = sigHandlers[event] ?? [];
    sigHandlers[event].push(handler);
    return process;
  }) as typeof process.on,
);
vi.spyOn(process, "off").mockImplementation(
  ((event: string, handler: (...args: unknown[]) => void) => {
    sigHandlers[event] = (sigHandlers[event] ?? []).filter(h => h !== handler);
    return process;
  }) as typeof process.off,
);

const { dockerTask } = await import("../dockerTask.js");

function findRunProc(): SpawnedProc {
  const proc = spawned.find(p => p.args[0] === "run");
  if (!proc) {
    throw new Error("docker run was not spawned");
  }
  return proc;
}

function findStopCalls(name: string): SpawnedProc[] {
  return spawned.filter(p => p.args[0] === "stop" && p.args.includes(name));
}

beforeEach(() => {
  spawned.length = 0;
  Object.keys(sigHandlers).forEach((k) => {
    sigHandlers[k] = [];
  });
});

describe("dockerTask shutdown", () => {
  it("runs `docker stop -t <stopTimeout> <name>` on SIGINT when name is set", async () => {
    vi.useFakeTimers();
    dockerTask("redis-shutdown-1", "redis:8", {
      name: "MyRedis",
      stopTimeout: 12,
    });
    const taskPromise = register.get("redis-shutdown-1")?.();

    // Trigger the SIGINT handler that dockerTask registered.
    sigHandlers.SIGINT[0]();

    const stops = findStopCalls("MyRedis");
    expect(stops).toHaveLength(1);
    expect(stops[0].args).toEqual(["stop", "-t", "12", "MyRedis"]);
    expect(stops[0].opts).toMatchObject({ stdio: "ignore", detached: true });
    expect(stops[0].unref).toHaveBeenCalledOnce();

    findRunProc().handlers.close(0);
    await taskPromise;
    vi.useRealTimers();
  });

  it("defaults stopTimeout to 5 when not specified", async () => {
    vi.useFakeTimers();
    dockerTask("redis-shutdown-2", "redis:8", { name: "MyRedis" });
    const taskPromise = register.get("redis-shutdown-2")?.();

    sigHandlers.SIGINT[0]();

    const stops = findStopCalls("MyRedis");
    expect(stops[0].args).toEqual(["stop", "-t", "5", "MyRedis"]);

    findRunProc().handlers.close(0);
    await taskPromise;
    vi.useRealTimers();
  });

  it("falls back to SIGTERM on the docker CLI when name is not set", async () => {
    vi.useFakeTimers();
    dockerTask("redis-shutdown-3", "redis:8");
    const taskPromise = register.get("redis-shutdown-3")?.();

    sigHandlers.SIGINT[0]();

    expect(spawned.filter(p => p.args[0] === "stop")).toHaveLength(0);
    expect(findRunProc().kill).toHaveBeenCalledWith("SIGTERM");

    findRunProc().handlers.close(0);
    await taskPromise;
    vi.useRealTimers();
  });

  it("is idempotent against repeated SIGINT", async () => {
    vi.useFakeTimers();
    dockerTask("redis-shutdown-4", "redis:8", { name: "MyRedis", stopTimeout: 7 });
    const taskPromise = register.get("redis-shutdown-4")?.();

    sigHandlers.SIGINT[0]();
    sigHandlers.SIGINT[0]();
    sigHandlers.SIGINT[0]();

    expect(findStopCalls("MyRedis")).toHaveLength(1);

    findRunProc().handlers.close(0);
    await taskPromise;
    vi.useRealTimers();
  });

  it("SIGKILLs the docker CLI as a safety net after (stopTimeout + 5) seconds", async () => {
    vi.useFakeTimers();
    dockerTask("redis-shutdown-5", "redis:8", { name: "MyRedis", stopTimeout: 8 });
    const taskPromise = register.get("redis-shutdown-5")?.();

    sigHandlers.SIGINT[0]();

    const runProc = findRunProc();
    vi.advanceTimersByTime(12_999);
    expect(runProc.kill).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2);
    expect(runProc.kill).toHaveBeenCalledWith("SIGKILL");

    runProc.handlers.close(0);
    await taskPromise;
    vi.useRealTimers();
  });
});
