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
  EmbedBuilder,
  InteractionContextType,
  ColorResolvable,
  Colors,
} from "discord.js";

import { Command } from "../../structures/Command";
import { replyEphemeral } from "../../utils/interactionUtils";

const user = new SlashCommandUserOption()
  .setName("target")
  .setDescription("the user you want the info")
  .setRequired(false);

const command: Command = new Command({
  name: "user",
  description: "user related commands",
  context: [
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  ],

  subcommands: [
    {
      name: "info",
      description: "get selected user info",
      builder: (data) => data.addUserOption(user),
      execute: async (interaction: ChatInputCommandInteraction) =>
        onUserInfo(interaction),
    },
    {
      name: "avatar",
      description: "get selected user avatar",
      builder: (data) => data.addUserOption(user),
      execute: async (interaction: ChatInputCommandInteraction) =>
        onUserAvatar(interaction),
    },
  ],
});

async function onUserInfo(interaction: ChatInputCommandInteraction) {
  const choosenUser = interaction.options.getUser(user.name);
  const iUser = choosenUser || interaction.user;

  const deco = iUser.avatarDecorationData
    ? hyperlink("link", iUser.avatarDecorationURL() || "")
    : "None";

  const embed = new EmbedBuilder();
  embed.setThumbnail(iUser.displayAvatarURL());
  embed.setTitle(iUser.displayName);
  embed.setURL(`https://discord.com/users/${iUser.id}`);

  embed.setDescription(`${bold("ID")} : ${iUser.id}
    ${bold("Username")} : ${escapeMarkdown(iUser.username)}
    ${bold("Decoration")} : ${deco}`);

  if (interaction.context === InteractionContextType.Guild) {
    const choosenMember = interaction.options.getMember(
      user.name,
    ) as GuildMember;
    const member = choosenMember || interaction.member;
    embed.setColor(member.displayColor);

    let roles: string = member.roles.cache
      .filter((r) => r.rawPosition > 0)
      .map((role) => `${roleMention(role.id)}`)
      .join(", ");

    if (!roles.length) roles = "None";
    if (roles.length > 1024) roles = roles.substring(0, 1020) + "...";

    const joinedAt = member.joinedAt
      ? `${time(member.joinedAt)} (${time(member.joinedAt, TimestampStyles.RelativeTime)})`
      : "Unknown";

    embed.addFields([
      { name: "Roles :", value: roles },
      { name: "Joined at :", value: joinedAt },
    ]);
  } else {
    const color = (await iUser.fetch(true)).accentColor as ColorResolvable;
    embed.setColor(color);
    const createdAt = iUser.createdAt
      ? `${time(iUser.createdAt)} (${time(iUser.createdAt, TimestampStyles.RelativeTime)})`
      : "Unknown";
    embed.addFields([{ name: "Joined discord at :", value: createdAt }]);
  }

  await interaction.reply({ embeds: [embed] });
}

async function onUserAvatar(interaction: ChatInputCommandInteraction) {
  let avatarUrl = "";
  let color: ColorResolvable = Colors.Blurple;

  if (interaction.context === InteractionContextType.Guild) {
    const member = (interaction.options.getMember(user.name) ||
      interaction.member) as GuildMember;

    avatarUrl = member.displayAvatarURL() ?? member.avatarURL();
    color = member.displayColor;
  } else {
    const iUser = interaction.options.getUser(user.name) || interaction.user;
    avatarUrl = iUser.displayAvatarURL();
    color = (await iUser.fetch(true)).accentColor as ColorResolvable;
  }

  if (avatarUrl)
    await interaction.reply({
      embeds: [new EmbedBuilder().setImage(avatarUrl).setColor(color)],
    });
  else
    await replyEphemeral(
      interaction,
      `No avatar found for ${interaction.user}`,
    );
}

export default command;
