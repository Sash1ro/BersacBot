import { Client } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

import { Event } from "../structures/Event";
const root = path.join(__dirname, "..");

const eventsPath = path.join(root, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

export function registerEvent(client: Client) {
  eventFiles.forEach((file) => {
    const filePath = path.join(eventsPath, file);
    const event: Event = require(filePath).default;

    if (!(event instanceof Event)) {
      console.warn(`The event at ${filePath} is not a valid Event instance.`);
      return;
    }

    if (event.once)
      client.once(event.name, (...args: any[]) => event.execute(...args));
    else client.on(event.name, (...args: any[]) => event.execute(...args));
  });
}
