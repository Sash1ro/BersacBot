import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  InteractionContextType,
  RGBTuple,
} from "discord.js";

export interface SubcommandOptions {
  name: string;
  description: string;
  builder?: (
    data: SlashCommandSubcommandBuilder,
  ) => SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

interface CommandOptions {
  name: string;
  description: string;
  perms?: bigint[];
  context?: InteractionContextType[];
  subcommands?: SubcommandOptions[];
  builder?: (
    data: SlashCommandBuilder,
  ) => SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute?: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class Command {
  public data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  public execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  public primaryColor: RGBTuple = [63, 55, 201];

  public constructor(options: CommandOptions) {
    const data = new SlashCommandBuilder()
      .setName(options.name)
      .setDescription(options.description);

    this.data = options.builder ? options.builder(data) : data;

    if (options.perms && options.perms.length > 0) {
      const combinedPerms = options.perms.reduce((acc, perm) => acc | perm, 0n);
      this.data.setDefaultMemberPermissions(combinedPerms);
    }

    if (options.context) this.data.setContexts(...options.context);
    else this.data.setContexts(InteractionContextType.Guild);

    if (options.subcommands && options.subcommands.length > 0) {
      options.subcommands.forEach((subCmd) => {
        (this.data as SlashCommandBuilder).addSubcommand((subBuilder) => {
          subBuilder.setName(subCmd.name).setDescription(subCmd.description);
          return subCmd.builder ? subCmd.builder(subBuilder) : subBuilder;
        });
      });

      this.execute = async (interaction: ChatInputCommandInteraction) => {
        const subCommandName = interaction.options.getSubcommand(false);

        if (subCommandName) {
          const targetSubcommand = options.subcommands!.find(
            (sub) => sub.name === subCommandName,
          );
          if (targetSubcommand) {
            return targetSubcommand.execute(interaction);
          }
        }
        if (options.execute) return options.execute(interaction);
      };
    } else {
      if (!options.execute) {
        throw new Error(
          `Command "${options.name}" requires an execute function.`,
        );
      }
      this.execute = options.execute;
    }
  }
}
