import { ActivityType, Client, Events, PresenceUpdateStatus } from "discord.js";
import { Event } from "../structures/Event";

const event = new Event({
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    client.user?.setStatus(PresenceUpdateStatus.DoNotDisturb);
    client.user?.setActivity("Le caca est cuit", {
      type: ActivityType.Playing,
    });
    console.info(`[INFO] Logged in as ${client.user?.tag}`);
  },
});

export default event;
