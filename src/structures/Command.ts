import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  ColorResolvable,
} from "discord.js";

interface CommandOptions {
  name: string;
  description: string;
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
  }
}
