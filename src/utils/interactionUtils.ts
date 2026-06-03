import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

export const replyEphemeral = async (
  interaction: ChatInputCommandInteraction,
  content: string,
) => {
  if (interaction.deferred) await interaction.editReply({ content });
  else if (interaction.replied)
    await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
  else await interaction.reply({ content, flags: MessageFlags.Ephemeral });
};

export const reply = async (
  interaction: ChatInputCommandInteraction,
  content: string,
) => {
  if (interaction.deferred) await interaction.editReply({ content });
  else if (interaction.replied) await interaction.followUp({ content });
  else await interaction.reply({ content });
};
