import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  ColorResolvable,
  InteractionContextType,
} from "discord.js";

interface CommandOptions {
  name: string;
  description: string;
  perms?: bigint[];
  context?: InteractionContextType[];
  builder?: (
    data: SlashCommandBuilder,
  ) => SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class Command {
  public data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  public execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  public primaryColor: ColorResolvable = [63, 55, 201];

  public constructor(options: CommandOptions) {
    const data = new SlashCommandBuilder()
      .setName(options.name)
      .setDescription(options.description);

    this.data = options.builder ? options.builder(data) : data;
    this.execute = options.execute;

    if (options.perms && options.perms.length > 0) {
      const combinedPerms = options.perms.reduce((acc, perm) => acc | perm, 0n);
      this.data.setDefaultMemberPermissions(combinedPerms);
    }

    if (options.context) this.data.setContexts(...options.context);
    else this.data.setContexts(InteractionContextType.Guild);
  }
}
