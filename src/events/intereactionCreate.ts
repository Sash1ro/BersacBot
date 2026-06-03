import {
  Events,
  GuildMember,
  Interaction,
  InteractionReplyOptions,
  MessageFlags,
} from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";
import { Logger } from "../utils/logger";

const event = new Event({
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as BotClient;
    const member = interaction.member as GuildMember;
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      Logger.error(error as string);

      let errorReply = {
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      } as InteractionReplyOptions;

      if (interaction.replied || interaction.deferred)
        await interaction.followUp(errorReply);
      else await interaction.reply(errorReply);
    }
  },
});

export default event;
