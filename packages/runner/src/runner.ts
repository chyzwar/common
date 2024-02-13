#! /usr/bin/env node
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
 
import {series} from "./series.js";
import Logger from "./Logger.js";
import {argv, cwd} from "node:process";
import SpawnError from "./SpawnError.js";

const logger = new Logger("runner");

async function handle(args: string[]): Promise<void> {
  try {
    await import(`${cwd()}/runner.config.js`);
  }
  catch (error: unknown) {
    logger.error(`Failed loading configuration ${error as string}`);
  }
  return series(...args)();
}

/**
 * Handle exceptions
 */
process.on("uncaughtException", (error) => {
  logger.error("uncaughtException", error);
});

process.on("unhandledRejection", (signal) => {
  logger.error("unhandledRejection", signal);
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
  });
  
