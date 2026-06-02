export class Logger {
  static info(message: string): void {
    console.log("[INFO] " + message);
  }

  static warn(message: string): void {
    console.log("[WARNING] " + message);
  }

  static error(message: string): void {
    console.log("[ERROR] " + message);
  }
}
