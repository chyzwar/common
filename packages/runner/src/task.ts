import type TaskFunction from "./TaskFunction.js";
import register from "./register.js";
import Logger from "./Logger.js";

/**
 * Register task
 */
export function task(taskName: string, taskFunction: TaskFunction): void {
  async function innerTask(): Promise<void> {
    const logger = new Logger(taskName);
    logger.info("Started task");

    try {
      logger.time("Task completed in");
      await taskFunction();
      logger.timeEnd("Task completed in");
    }
    catch (error) {
      logger.error(`Task ${taskName} failed with: ${error as string}`);
      throw error;
    }
  }
  register.set(taskName, innerTask);
}
