import {
  Events,
  GuildMember,
  Interaction,
  InteractionReplyOptions,
  MessageFlags,
} from "discord.js";
import { Event } from "../structures/Event";
import { BotClient } from "../structures/BotClient";
import { ErrorEmbed } from "../structures/ErrorEmbed";

const event = new Event({
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as BotClient;
    const member = interaction.member as GuildMember;
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    if (command.perms !== null) {
      if (!member.permissions.has(command.perms)) {
        const embed = new ErrorEmbed(
          "You dont have the permission to perform this command",
        );
        if (interaction.replied || interaction.deferred)
          await interaction.followUp({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
          });
        else
          await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
          });
      }
    }

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
