import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  EmbedBuilder,
  SlashCommandStringOption,
  GuildMember,
} from "discord.js";

import { Command } from "../../structures/Command";
import { ErrorEmbed } from "../../structures/ErrorEmbed";

const target = new SlashCommandUserOption()
  .setName("target")
  .setDescription("The user you want to ban")
  .setRequired(true);

const reason = new SlashCommandStringOption()
  .setName("reason")
  .setDescription("The reason of the kick")
  .setRequired(false);

const command = new Command({
  name: "kick",
  description: "kick a user",
  perms: ["KickMembers"],
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onKick(interaction),
});

async function onKick(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getMember(target.name) as GuildMember | null;
  const r = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  if (!user.moderatable) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("I don't have permission to kick this user.")],
    });
    return;
  }

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user.displayName} was kicked from this server`);
  embed.setColor(command.primaryColor);

  await interaction.guild?.members.kick(user, r ? r : "No reason provided");
  await interaction.reply({ embeds: [embed] });
}

export default command;
