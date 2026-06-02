import {
  ChatInputCommandInteraction,
  SlashCommandUserOption,
  GuildMember,
  bold,
  roleMention,
  time,
  escapeMarkdown,
  TimestampStyles,
  hyperlink,
} from "discord.js";

import { Command } from "../../structures/Command";
import { SuccessEmbed } from "../../structures/SuccessEmbed";

const user = new SlashCommandUserOption()
  .setName("target")
  .setDescription("the user you want the info")
  .setRequired(false);

const command: Command = new Command({
  name: "userinfo",
  description: "get the selected user info or yourself",

  builder: (data) => data.addUserOption(user),

  execute: async (interaction: ChatInputCommandInteraction) =>
    onUser(interaction),
});

async function onUser(interaction: ChatInputCommandInteraction) {
  const member = (interaction.options.getMember(user.name) ||
    interaction.member) as GuildMember;

  const embed = new SuccessEmbed();
  embed.setColor(member.displayColor || null);
  embed.setThumbnail(member.displayAvatarURL());
  embed.setTitle(member.displayName);
  embed.setURL(`https://discord.com/users/${member.id}`);

  const deco = member.user.avatarDecorationData
    ? hyperlink("link", member.user.avatarDecorationURL() || "")
    : "None";

  let roles: string = member.roles.cache
    .filter((r) => r.rawPosition > 0)
    .map((role) => `${roleMention(role.id)}`)
    .join(", ");

  if (!roles.length) roles = "None";
  if (roles.length > 1024) roles = roles.substring(0, 1020) + "...";

  embed.setDescription(`
    ${bold("ID")} : ${member.id}
    ${bold("Username")} : ${escapeMarkdown(member.user.tag)}
    ${bold("Decoration")} : ${deco}
    `);

  const joinedAt = member.joinedAt
    ? `${time(member.joinedAt)} (${time(member.joinedAt, TimestampStyles.RelativeTime)})`
    : "Unknown";
  const createdAt = member.user.createdAt
    ? `${time(member.user.createdAt)} (${time(member.user.createdAt, TimestampStyles.RelativeTime)})`
    : "Unknown";

  embed.setFields([
    { name: "Roles :", value: roles },
    { name: "Joined at :", value: joinedAt },
    { name: "Joined discord at :", value: createdAt },
  ]);

  interaction.reply({ embeds: [embed] });
}

export default command;
