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
  .setDescription("The reason of the ban")
  .setRequired(false);

const command = new Command({
  name: "ban",
  description: "ban a user",
  perms: ["BanMembers"],
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onBan(interaction),
});

async function onBan(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getMember(target.name) as GuildMember | null;
  const reasono = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  if (!user.moderatable) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("I don't have permission to ban this user.")],
    });
    return;
  }

  const embed = new EmbedBuilder();

  embed.setTitle("Moderation");
  embed.setDescription(`${user?.displayName} was banned from this server `);
  embed.setColor(command.primaryColor);

  if (reasono) {
    embed.addFields([{ name: "Reason : ", inline: true, value: reasono }]);
  }

  await interaction.guild?.members.ban(user, {
    reason: reasono ? reasono : "No reason provided",
  });

  await interaction.reply({ embeds: [embed] });
}

export default command;
