#! /usr/bin/env node
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { series } from "./series.js";
import Logger from "./Logger.js";
import process, { argv, cwd } from "node:process";
import SpawnError from "./SpawnError.js";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

process.title = "runner";

const logger = new Logger("runner");

async function handle(args: string[]): Promise<void> {
  try {
    const configTs = join(cwd(), "runner.config.ts");
    const configJs = join(cwd(), "runner.config.js");
    const config = existsSync(configTs)
      ? configTs
      : configJs;

    await import(pathToFileURL(config).href);
  }
  catch (error: unknown) {
    logger.error(`Failed loading configuration ${error}`);
  }
  return series(...args)();
}

/**
 * Handle exceptions
 */
process.on("uncaughtException", (error) => {
  logger.error("uncaughtException", error);
  process.exit(1);
});

process.on("unhandledRejection", (signal) => {
  logger.error("unhandledRejection", signal);
  process.exit(1);
});

const tasks = argv.slice(2, 3);
const label = `Completed tasks: ${tasks.join(", ")} in `;

logger.time(label);
handle(tasks)
  .then(() => {
    logger.timeEnd(label);
  })
  .catch((error: Error | SpawnError) => {
    if (error instanceof SpawnError) {
      logger.error(`Failed with code: ${error.code} on task: <${error.taskName}>`);
    }
    if (error instanceof Error) {
      logger.error(`Failed with error: ${error}`);
    }
    process.exit(1);
  });
