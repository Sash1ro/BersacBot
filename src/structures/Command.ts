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
    this.applyPerms(options.perms);
    this.applyCtx(options.context);

    if (options.subcommands && options.subcommands.length > 0) {
      this.registerSubCmds(options.subcommands);
      this.execute = this.buildDispatcher(options.subcommands);
    } else {
      if (!options.execute)
        throw new Error(
          `Command "${options.name}" requires an execute function.`,
        );

      this.execute = options.execute;
    }
  }

  private applyPerms(perms?: bigint[]): void {
    if (perms && perms.length > 0) {
      const combinedPerms = perms.reduce((acc, perm) => acc | perm, 0n);
      this.data.setDefaultMemberPermissions(combinedPerms);
    }
  }

  private applyCtx(context?: InteractionContextType[]): void {
    if (context) this.data.setContexts(...context);
    else this.data.setContexts(InteractionContextType.Guild);
  }

  private registerSubCmds(subcommands: SubcommandOptions[]): void {
    subcommands.forEach((subCmd) => {
      (this.data as SlashCommandBuilder).addSubcommand((subBuilder) => {
        subBuilder.setName(subCmd.name).setDescription(subCmd.description);
        return subCmd.builder ? subCmd.builder(subBuilder) : subBuilder;
      });
    });
  }

  private buildDispatcher(
    subcommands: SubcommandOptions[],
  ): (interaction: ChatInputCommandInteraction) => Promise<void> {
    return async (interaction: ChatInputCommandInteraction) => {
      const subCommandName = interaction.options.getSubcommand(false);

      if (subCommandName) {
        const targetSubcommand = subcommands.find(
          (sub) => sub.name === subCommandName,
        );
        if (targetSubcommand) return targetSubcommand.execute(interaction);
        throw new Error(`Unknown subcommand "${subCommandName}"`);
      }
    };
  }
}
