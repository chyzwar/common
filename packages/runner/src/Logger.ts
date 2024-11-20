import pc from "picocolors";
import type { Formatter } from "picocolors/types.js";

const colorFormatters: Formatter[] = [
  pc.green,
  pc.red,
  pc.yellow,
  pc.blue,
  pc.magenta,
  pc.cyan,
  pc.white,
  pc.gray,
];

let lastAssigned = 0;
const colorsAssigned: Record<string, Formatter> = {};

const getColorFn = (taskName: string): Formatter => {
  if (!(taskName in colorsAssigned)) {
    colorsAssigned[taskName] = colorFormatters[lastAssigned++ % 8];
  }

  return colorsAssigned[taskName];
};

class Logger {
  public static calls: unknown[][];

  private readonly taskName: string;
  private readonly colorFn: Formatter;

  public constructor(taskName: string) {
    this.taskName = taskName;
    this.colorFn = getColorFn(taskName);
  }

  public time(label: string): void {
    console.time(`${this.colorFn(`[${this.taskName}]`)} ${label}`);
  }

  public timeEnd(label: string): void {
    console.timeEnd(`${this.colorFn(`[${this.taskName}]`)} ${label}`);
  }

  public log(message = ""): void {
    console.time(`${this.colorFn(`[${this.taskName}]`)} ${message}`);
  }

  public warn(message = "", meta: unknown = ""): void {
    console.warn(`${this.colorFn(`[${this.taskName}]`)}${pc.yellow("[warn]")} ${message}`, meta);
  }

  public error(message = "", meta: unknown = ""): void {
    console.error(`${this.colorFn(`[${this.taskName}]`)}${pc.red("[error]")} ${message}`, meta);
  }

  public info(message = ""): void {
    console.log(`${this.colorFn(`[${this.taskName}]`)} ${message}`);
  }
}

export default Logger;
