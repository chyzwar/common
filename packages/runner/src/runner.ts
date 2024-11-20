#! /usr/bin/env node
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */

import { series } from "./series.js";
import Logger from "./Logger.js";
import { argv, cwd } from "node:process";
import SpawnError from "./SpawnError.js";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const encoding = { encoding: "utf-8" as const };
const removeOpts = {
  force: true,
  recursive: true,
};

const logger = new Logger("runner");

const importTS = async (path: string): Promise<void> => {
  const {
    default: {
      transpileModule,
      ScriptTarget,
      ModuleKind,
    },
  } = await import("typescript");

  const source = readFileSync(path, encoding);
  const { outputText } = transpileModule(source, {
    compilerOptions: {
      target: ScriptTarget.ES2020,
      module: ModuleKind.ESNext,
    },
  });

  const compiledConfigPath = `${path}.mjs`;
  try {
    writeFileSync(
      compiledConfigPath,
      outputText,
    );
    await import(compiledConfigPath);
  }

  finally {
    rmSync(compiledConfigPath, removeOpts);
  }
};

async function handle(args: string[]): Promise<void> {
  try {
    if (existsSync(`${cwd()}/runner.config.ts`)) {
      await importTS(`${cwd()}/runner.config.ts`);
    }
    else {
      await import(`${cwd()}/runner.config.js`);
    }
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
