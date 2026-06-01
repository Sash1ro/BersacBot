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
  name: "kick",
  description: "kick an user",
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onKick(interaction),
});

async function onKick(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getUser(target.name, target.required);
  const r = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user.displayName} was kicked from this server`);
  embed.setColor(command.primaryColor);

  await interaction.guild?.members.kick(user, r ? r : "No reason provided");
  await interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [embed] });
}

export default command;
