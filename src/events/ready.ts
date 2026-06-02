import { Events } from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";

const event = new Event({
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    client.log();
    client.updateActivity();
  },
});

export default event;
