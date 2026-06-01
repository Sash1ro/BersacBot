import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";

const event = new Event({
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    console.info(`[INFO] Logged in as ${client.user?.tag}`);
    client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
    client.user?.setActivity("Le caca est cuit", {
      type: ActivityType.Playing,
    });
  },
});

export default event;
