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
import { BotClient } from "../../structures/BotClient";

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

  const webhook = await (interaction.client as BotClient).getWebhookForChannel(
    channel,
  );

  await webhook.send({
    content: message,
    isUser: true,
    username: user.displayName || user.user.displayName,
    avatarURL: user.displayAvatarURL({ forceStatic: false }),
  });

  await interaction.reply({
    embeds: [new SuccessEmbed(`Message sent to ${channel.name}`)],
    flags: MessageFlags.Ephemeral,
  });
}

export default command;
