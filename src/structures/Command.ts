import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  ColorResolvable,
  PermissionResolvable,
} from "discord.js";

interface CommandOptions {
  name: string;
  description: string;
  builder?: (
    data: SlashCommandBuilder,
  ) => SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  perms?: PermissionResolvable;
}

export class Command {
  public data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  public execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  public primaryColor: ColorResolvable = [63, 55, 201];
  public perms: PermissionResolvable | null = null;

  public constructor(options: CommandOptions) {
    const data = new SlashCommandBuilder()
      .setName(options.name)
      .setDescription(options.description);

    this.data = options.builder ? options.builder(data) : data;
    this.execute = options.execute;

    this.perms = options.perms ? options.perms : null;
  }
}
