import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  EmbedBuilder,
  SlashCommandStringOption,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";

import { Command } from "../../structures/Command";
import { ErrorEmbed } from "../../structures/ErrorEmbed";

const target = new SlashCommandUserOption()
  .setName("target")
  .setDescription("The user you want to ban")
  .setRequired(true);

const reason = new SlashCommandStringOption()
  .setName("reason")
  .setDescription("The reason of the unban")
  .setRequired(false);

const command = new Command({
  name: "unban",
  description: "unban a user",
  perms: [PermissionFlagsBits.BanMembers],
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onUnBan(interaction),
});

async function onUnBan(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getMember(target.name) as GuildMember | null;
  const r = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  if (!user.moderatable) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("I don't have permission to unban this user.")],
    });
    return;
  }

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user.displayName} was unbanned from this server`);
  embed.setColor(command.primaryColor);

  if (r) {
    embed.addFields([{ name: "Reason : ", inline: true, value: r }]);
  }

  await interaction.guild?.members.unban(user, r ? r : "No reason provided");
  await interaction.reply({ embeds: [embed] });
}

export default command;
