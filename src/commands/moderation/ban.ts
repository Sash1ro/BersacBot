import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  EmbedBuilder,
} from "discord.js";

import { Command } from "../../structures/Command";
import { ErrorEmbed } from "../../structures/ErrorEmbed";

const target = new SlashCommandUserOption()
  .setName("target")
  .setDescription("The user you want to ban")
  .setRequired(true);

const command = new Command({
  name: "ban",
  description: "ban an user",
  builder: (data: SlashCommandBuilder) => data.addUserOption(target),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onBan(interaction),
});

async function onBan(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser(target.name, target.required);

  if (!user) {
    const error = new ErrorEmbed("To ban someone you need to provide the user");
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [error],
    });
    return;
  }

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user.displayName} was banned from this server`);
  embed.setColor(command.primaryColor);

  await interaction.guild?.members.ban(user);
  await interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [embed] });
}

export default command;
