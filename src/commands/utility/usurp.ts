import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";
import { SuccessEmbed } from "../../structures/SuccessEmbed";

const userOption = new SlashCommandUserOption()
  .setName("user")
  .setDescription("The user you want to usurp")
  .setRequired(true);

const messageOption = new SlashCommandStringOption()
  .setName("message")
  .setDescription("the message the bot will send")
  .setRequired(true);

const channelOption = new SlashCommandChannelOption()
  .setName("channel")
  .setDescription("the channel to send the message in")
  .setRequired(false);

const command = new Command({
  name: "usurp",
  description: "send a message as a user",
  builder: (data: SlashCommandBuilder) =>
    data
      .addUserOption(userOption)
      .addStringOption(messageOption)
      .addChannelOption(channelOption),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onTalk(interaction),
});

async function onTalk(interaction: ChatInputCommandInteraction) {
  const channel =
    (interaction.options.getChannel(channelOption.name) as TextChannel) ??
    (interaction.channel as TextChannel);
  const message = interaction.options.getString(messageOption.name, true);
  const user = interaction.options.getMember(userOption.name) as GuildMember;
  const wbName = "Bot Shadow Editor";

  const channelWebhooks = await channel.fetchWebhooks();
  let webhook = channelWebhooks.find((c) => c.name === wbName);

  if (!webhook) {
    webhook = await channel.createWebhook({
      name: wbName,
      avatar: user.displayAvatarURL(),
    });
  }

  await webhook.send({
    content: message,
    isUser: true,
    username: user.displayName || user.user.displayName,
    avatarURL: user.displayAvatarURL(),
  });

  await interaction.reply({
    embeds: [new SuccessEmbed(`Message sent to ${channel.name}`)],
    flags: MessageFlags.Ephemeral,
  });
}

export default command;
