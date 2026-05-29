import { Events } from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";

const event = new Event({
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    console.info(`[INFO] Logged in as ${client.user?.tag}`);
  },
});

export default event;
