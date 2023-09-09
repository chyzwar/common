
import type TaskFunction from "./TaskFunction.js";
import register from "./register.js";

/**
 * Map task names to task function,
 * Find and error if task is missing
 */
function mapToTasks(taskNames: string[]): TaskFunction[] {
  return taskNames.map((task: string) => {
    const taskFn = register.get(task);
    if (taskFn) {
      return taskFn;
    }
    else {
      throw Error(`Missing tasks definition for: ${task}`);
    }
  });
}

  

export default mapToTasks;