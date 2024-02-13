import Logger from "./Logger.js";
import type TaskFunction from "./TaskFunction.js";
import mapToTasks from "./mapToTasks.js";
import register from "./register.js";

/**
 * Execute task in order (sequentially)
 * @param args task names
 */
export function series(...args: string[]): TaskFunction {
  const seriesTaskFn = async(): Promise<void> => {
    for (const task of mapToTasks(args)) {
      await task();
    }
  };
  return seriesTaskFn;
}

/**
 * Create task to start multiple tasks in series
 * @param task task name
 * @param taskList command to spawn
 */
export function seriesTask(taskName: string, taskList: string[]): void {

  async function seriesTaskFunction(): Promise<void> {
    const logger = new Logger(taskName);
    logger.info("Started task");
    logger.time("Task completed in");
    
    await series(...taskList)();
    logger.timeEnd("Task completed in");
  }

  register.set(taskName, seriesTaskFunction);
} 