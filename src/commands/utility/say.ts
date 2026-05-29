import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";

const messageOption = new SlashCommandStringOption()
  .setName("message")
  .setDescription("the message the bot will send")
  .setRequired(true);

const channelOption = new SlashCommandChannelOption()
  .setName("channel")
  .setDescription("the channel to send the message in")
  .setRequired(false);

const command = new Command({
  name: "say",
  description: "send a message via the bot",
  builder: (data: SlashCommandBuilder) =>
    data.addStringOption(messageOption).addChannelOption(channelOption),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onTalk(interaction),
});

async function onTalk(interaction: ChatInputCommandInteraction) {
  const channel =
    (interaction.options.getChannel(channelOption.name) as TextChannel) ??
    (interaction.channel as TextChannel);
  const message = interaction.options.getString(messageOption.name);

  if (!message) {
    interaction.reply({
      content: "Message is needed",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await channel.send({ content: message });
  await interaction.reply({
    content: `Message sent to ${channel.name}`,
    flags: MessageFlags.Ephemeral,
  });
}

export default command;
