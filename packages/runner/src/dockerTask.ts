import { spawn } from "node:child_process";
import type { SpawnOptions } from "node:child_process";

import register from "./register.js";
import Logger from "./Logger.js";
import SpawnError from "./SpawnError.js";

interface DockerTaskOptions extends SpawnOptions {
  /**
   * Debug mode, print full docker command
   */
  debug?: boolean;

  /**
   * Automatically remove the container when it exits
   */
  rm?: boolean;

  /**
   * Keep STDIN open even if not attached
   */
  interactive?: boolean;

  /**
   * Assign a name to the container
   */
  name?: string;

  /**
   * List of ports to expose
   */
  ports?: `${number}:${number}`[];

  /**
   * List of volumes to mount in container
   */
  volumes?: `${string}:${string}`[];
  /**
   * Type of network
   */
  network?: "bridge" | "host";

  /**
   * Username or UID (format: <name|uid>[:<group|gid>])
   */
  user?: string;

  /**
   * Log driver
   */
  logDriver?: "json-file" | "syslog" | "journald" | "gelf" | "fluentd" | "awslogs" | "splunk" | "etwlogs" | "gcplogs" | "azurelogs" | "none";

  /**
   * Log driver options
   */
  logDriverOptions?: Record<string, string>;

  /**
   * The maximum amount of memory the container can use.
   * If you set this option, the minimum allowed value is 6m (6 megabytes). That is, you must set the value to at least 6 megabytes.
   */
  memory?: number;

  /**
   * The amount of memory this container is allowed to swap to disk.
   */
  memorySwap?: number;

  /**
   * A value of 0 turns off anonymous page swapping.
   * A value of 100 sets all anonymous pages as swappable.
   */
  memorySwappiness?: number;
}

/**
 * Create task to run docker container
 * @param task task name
 * @param image name of container image
 * @param args arguments for command
 * @param options spawn option
 */
export function dockerTask(taskName: string, image: string, options?: DockerTaskOptions): void {
  const args = ["run"];
  if (options?.rm) {
    args.push("--rm");
  }
  if (options?.network) {
    args.push(`--network=${options.network}`);
  }
  if (options?.interactive) {
    args.push("--interactive");
  }

  if (options?.user) {
    args.push(`--user ${options.user}`);
  }

  if (options?.name) {
    args.push(`--name ${options.name}`);
  }

  if (options?.logDriver) {
    args.push(`--log-driver ${options.logDriver}`);
  }

  if (typeof options?.memory === "number") {
    args.push(`--memory ${options.memory}`);
  }

  if (typeof options?.memorySwap === "number") {
    args.push(`--memory-swap ${options.memorySwap}`);
  }

  if (typeof options?.memorySwappiness === "number") {
    args.push(`--memory-swappiness ${options.memorySwappiness}`);
  }

  if (options?.logDriverOptions) {
    Object
      .entries(options.logDriverOptions)
      .forEach(([key, value]) => {
        if (value) {
          args.push(`--log-opt ${key}=${value}`);
        }
      });
  }

  if (options?.env) {
    Object
      .entries(options.env)
      .forEach(([key, value]) => {
        if (value) {
          args.push(`-e ${key}=${value}`);
        }
      });
  }

  if (options?.ports) {
    options.ports
      .forEach((value) => {
        if (value.includes(":")) {
          args.push(`-p ${value}`);
        }
      });
  }

  if (options?.volumes) {
    options.volumes
      .forEach((value) => {
        if (value.includes(":")) {
          args.push(`-v ${value}`);
        }
      });
  }

  args.push(image);

  async function spawnTaskFunction(): Promise<void> {
    const logger = new Logger(taskName);
    logger.info("Started task");
    if (options?.debug) {
      logger.info(`docker ${args.join(" ")}`);
    }
    logger.time("Task completed in");
    const proc = spawn("docker", args, { shell: true });

    return new Promise<void>((resolve, reject) => {
      proc.stdout.on("data", (data?: Buffer) => {
        if (data) {
          data
            .toString()
            .split("\n")
            .filter(s => s !== "")
            .forEach((line: string) => {
              logger.info(line);
            });
        }
      });

      proc.stderr.on("data", (data?: Buffer) => {
        if (data) {
          data
            .toString()
            .split("\n")
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
            new SpawnError("Docker Task closed with non-zero exit code", code, taskName),
          );
        }
      });
    });
  }

  register.set(taskName, spawnTaskFunction);
}

export default dockerTask;
