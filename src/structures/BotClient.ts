import {
  ActivityType,
  BaseGuildTextChannel,
  Client,
  Collection,
  GatewayIntentBits,
  PresenceStatusData,
  PresenceUpdateStatus,
  TextChannel,
  Webhook,
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

  private wbName: string = "Bot Shadow Editor";

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

  public async getWebhookForChannel(
    channel: TextChannel | BaseGuildTextChannel,
  ): Promise<Webhook> {
    const channelWebhooks = await channel.fetchWebhooks();
    let webhook = channelWebhooks.find((c) => c.name === this.wbName);

    if (!webhook) {
      webhook = await channel.createWebhook({
        name: this.wbName,
        avatar: this.user?.displayAvatarURL(),
      });
    }

    return webhook;
  }
}
