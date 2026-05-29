import { Events } from "discord.js";

interface EventOptions {
  name: Events | string;
  once?: boolean;
  execute: (...args: any[]) => void | Promise<void>;
}

export class Event {
  public name: Events | string;
  public once: boolean = false;
  public execute: (...args: any[]) => void | Promise<void>;

  public constructor(options: EventOptions) {
    this.name = options.name;
    this.once = options.once ?? false;

    this.execute = options.execute;
  }
}
