import {
  ActivityType,
  Client,
  Collection,
  GatewayIntentBits,
  PresenceStatusData,
  PresenceUpdateStatus,
} from "discord.js";
import { Command } from "./Command";
import { Logger } from "../utils/logger";

export class BotClient extends Client {
  public commands: Collection<string, Command> = new Collection<
    string,
    Command
  >();

  public status: PresenceStatusData = PresenceUpdateStatus.DoNotDisturb;
  public activity: string = "Le caca est cuit";
  public activtyType: ActivityType = ActivityType.Playing;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
      ],
    });
  }

  public log(): void {
    Logger.info(`Logged in as ${this.user?.tag}`);
  }

  public updateActivity(): void {
    this.user?.setStatus(this.status);
    this.user?.setActivity(this.activity, {
      type: this.activtyType,
    });
  }
}
