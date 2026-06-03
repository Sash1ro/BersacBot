export class Logger {
  public static RESET: string = " \x1b[0m";
  public static RED: string = "\x1b[31m ";
  public static YELLOW: string = "\x1b[33m ";
  public static BLUE: string = "\x1b[34m ";

  static logColored(color: string, message: string) {
    console.log(color + message + Logger.RESET);
  }

  static info(message: string): void {
    Logger.logColored(Logger.BLUE, "[INFO] " + message);
  }

  static warn(message: string): void {
    Logger.logColored(Logger.YELLOW, "[WARNING] " + message);
  }

  static error(message: string): void {
    Logger.logColored(Logger.RED, "[ERROR] " + message);
  }
}
