#! /usr/bin/env node
 
import {series} from "./series.js";
import Logger from "./Logger.js";
import {cwd} from "node:process";
import type SpawnError from "./SpawnError.js";

const logger = new Logger("runner");

async function handle(argv: string[]): Promise<void> {
  try {
    await import(`${cwd()}/runner.config.js`);
  }
  catch (error: unknown) {
    logger.error(`Failed loading configuration ${error as string}`);
  }

  const label = `Completed tasks: ${argv.join(", ")} in`;
  
  logger.time(label);
  await series(...argv)();
  logger.timeEnd(label);
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


handle(process.argv.slice(2, 3))
  .catch((info: SpawnError) => {
    logger.error(`Failed with code: ${info.code} on task: <${info.taskName}>`);
  });
  
