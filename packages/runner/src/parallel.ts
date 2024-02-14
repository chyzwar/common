import Logger from "./Logger.js";
import mapToTasks from "./mapToTasks.js";
import register from "./register.js";
import type TaskFunction from "./TaskFunction.js";

export function parallel(...args: string[]): TaskFunction {
  const parallelTaskFn = async(): Promise<void> => {
    await Promise.all(mapToTasks(args).map(async(task) => task()));
  };

  return parallelTaskFn;
}


/**
 * Create task to start multiple tasks in parallel
 * @param task task name
 * @param taskList command to spawn
 */
export function parallelTask(taskName: string, taskList: string[]): void {

  async function parallelTaskFunction(): Promise<void> {
    const logger = new Logger(taskName);
    logger.info("Started task");
    
    logger.time("Task completed in");
    await parallel(...taskList)();
    logger.timeEnd("Task completed in");
  }

  register.set(taskName, parallelTaskFunction);
} 
