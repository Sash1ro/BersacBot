import {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
  PresenceUpdateStatus,
} from "discord.js";
import { Command } from "./Command";

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection<
    string,
    Command
  >();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }
}
