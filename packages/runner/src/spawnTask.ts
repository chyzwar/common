import { createWriteStream, existsSync, rmSync } from "fs";
import { spawn } from "child_process";
import register from "./register.js";
import Logger from "./Logger.js";
import SpawnError from "./SpawnError.js";
import type { SpawnOptions } from "child_process";

interface SpawnTaskOptions extends SpawnOptions {
  /**
   * Debug mode, print full docker command
   */
  debug?: boolean;

  /**
   * Log stdout and stderr to file
   */
  logFile?: string;
}

/**
 * Create task to spawn process
 * @param task task name
 * @param command command to spawn
 * @param args arguments for command
 * @param options spawn option
 */
export function spawnTask(taskName: string, command: string, args: string[] = [], options: SpawnTaskOptions = {}): void {
  async function spawnTaskFunction(): Promise<void> {
    const logger = new Logger(taskName);
    logger.info("Started task");
    logger.time("Task completed in");

    const spawnOptions: SpawnOptions = {
      ...options,
      env: {
        ...process.env,
        FORCE_COLOR: "1",
        ...options.env,
      },
    };

    const proc = spawn(command, args, spawnOptions);

    if (options.debug) {
      logger.info(`${command} ${args.join(" ")}`);
    }

    return new Promise<void>((resolve, reject) => {
      if (options.logFile) {
        if (existsSync(options.logFile)) {
          rmSync(options.logFile);
        }
        const logFile = createWriteStream(options.logFile, { flags: "a" });
        proc.stdout?.pipe(logFile);
        proc.stderr?.pipe(logFile);
      }
      else {
        proc.stdout?.on("data", (data?: Buffer) => {
          if (data) {
            data
              .toString()
              .split(/\r?\n/)
              .filter(s => s !== "")
              .forEach((line: string) => {
                logger.info(line);
              });
          }
        });

        proc.stderr?.on("data", (data?: Buffer) => {
          if (data) {
            data
              .toString()
              .split(/\r?\n/)
              .filter(s => s !== "")
              .forEach((line: string) => {
                logger.info(line);
              });
          }
        });

        proc.on("error", (error) => {
          logger.error(`Task <${taskName}> failed with:`, error);
        });

        proc.on("close", (code: number) => {
          if (code === 0) {
            logger.timeEnd("Task completed in");
            resolve();
          }
          else {
            logger.error(`Failed with code: ${code}`);
            reject(
              new SpawnError("Spawn Task closed with non-zero exit code", code, taskName),
            );
          }
        });
      }
    });
  }

  register.set(taskName, spawnTaskFunction);
}
