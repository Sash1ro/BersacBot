import {
  Events,
  Interaction,
  InteractionReplyOptions,
  MessageFlags,
} from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";

const event = new Event({
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as BotClient;
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

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
