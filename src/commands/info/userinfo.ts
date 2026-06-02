import {
  ChatInputCommandInteraction,
  SlashCommandUserOption,
  GuildMember,
  bold,
  roleMention,
  time,
  escapeMarkdown,
  TimestampStyles,
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
  const member =
    (interaction.options.getMember(user.name) as GuildMember) ??
    (interaction.member as GuildMember);

  const embed = new SuccessEmbed();
  embed.setColor(member.displayColor);
  embed.setThumbnail(member.displayAvatarURL());
  embed.setTitle(member.displayName);
  embed.setURL(`https://discord.com/users/${member.id}`);

  const deco = member.user.avatarDecorationData
    ? `[link](${member.user.avatarDecorationURL()})`
    : "None";

  const roles: string = member.roles.cache
    .filter((r) => r.rawPosition > 0)
    .map((role) => `${roleMention(role.id)}`)
    .join(", ");

  embed.setDescription(`
    ${bold("ID")} : ${member.id}
    ${bold("Username")} : ${escapeMarkdown(member.user.tag)}
    ${bold("Decoration")} : ${deco}
    `);

  embed.setFields([
    {
      name: "Roles :",
      value: roles,
    },
    {
      name: "Joined at :",
      value: `${time(member.joinedAt as Date)} (${time(member.joinedAt as Date, TimestampStyles.RelativeTime)})`,
    },
    {
      name: "Joined discord at :",
      value: `${time(member.user.createdAt as Date)} (${time(member.user.createdAt as Date, TimestampStyles.RelativeTime)})`,
    },
  ]);

  interaction.reply({ embeds: [embed] });
}

export default command;
