#! /usr/bin/env node
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { series } from "./series.js";
import Logger from "./Logger.js";
import process, { argv, cwd } from "node:process";
import SpawnError from "./SpawnError.js";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

process.title = "runner";

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
    await import(pathToFileURL(compiledConfigPath).href);
  }

  finally {
    rmSync(compiledConfigPath, removeOpts);
  }
};

async function handle(args: string[]): Promise<void> {
  try {
    const configTs = join(cwd(), "runner.config.ts");
    if (existsSync(configTs)) {
      await importTS(configTs);
    }
    else {
      const { href } = pathToFileURL(join(cwd(), "runner.config.js"));
      await import(href);
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
