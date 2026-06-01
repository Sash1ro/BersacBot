import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  EmbedBuilder,
  SlashCommandStringOption,
} from "discord.js";

import { Command } from "../../structures/Command";
import { ErrorEmbed } from "../../structures/ErrorEmbed";

const target = new SlashCommandUserOption()
  .setName("target")
  .setDescription("The user you want to ban")
  .setRequired(true);

const reason = new SlashCommandStringOption()
  .setName("reason")
  .setDescription("The reason of the ban")
  .setRequired(false);

const command = new Command({
  name: "ban",
  description: "ban an user",
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onBan(interaction),
});

async function onBan(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser(target.name, target.required);
  const reasono = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user?.displayName} was banned from this server`);
  embed.setColor(command.primaryColor);

  await interaction.guild?.members.ban(user, {
    reason: reasono ? reasono : "No reason provided",
  });

  await interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [embed] });
}

export default command;
