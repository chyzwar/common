import { afterEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { execPath } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

// Drives the compiled lib/runner.js in a real Node process: only the native ESM
// loader can show whether a config path survives being passed to import().
const libDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../lib");
const taskModule = pathToFileURL(join(libDir, "task.js")).href;
const config = `import { task } from "${taskModule}";\n\ntask("test", () => undefined);\n`;

interface RunnerResult {
  status: number | null;
  output: string;
}

let tempDir = "";

// "#" turns a bare path into a URL fragment, the same way "C:\" turns into a URL scheme on Windows
function runnerWithConfig(fileName: string): RunnerResult {
  tempDir = mkdtempSync(join(tmpdir(), "runner-"));
  const cwd = join(tempDir, "url-hostile#dir");
  mkdirSync(cwd);
  writeFileSync(join(cwd, fileName), config);

  const { status, stdout, stderr } = spawnSync(execPath, [join(libDir, "runner.js"), "test"], { cwd, encoding: "utf8" });
  return { status, output: stdout + stderr };
}

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true });
});

describe("runner config path", () => {
  it("loads runner.config.ts from a cwd that is not a valid URL path", () => {
    const { status, output } = runnerWithConfig("runner.config.ts");

    expect(output).not.toContain("Failed loading configuration");
    expect(output).toContain("Started task");
    expect(status).toBe(0);
  });

  it("loads runner.config.js from a cwd that is not a valid URL path", () => {
    const { status, output } = runnerWithConfig("runner.config.js");

    expect(output).not.toContain("Failed loading configuration");
    expect(output).toContain("Started task");
    expect(status).toBe(0);
  });
});
