import {
  ChatInputCommandInteraction,
  DMChannel,
  GuildTextBasedChannel,
  InteractionContextType,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
} from "discord.js";
import { Command } from "../../structures/Command";
import { reply, replyEphemeral } from "../../utils/interactionUtils";

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
  context: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ],
  builder: (data: SlashCommandBuilder) =>
    data.addStringOption(messageOption).addChannelOption(channelOption),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onExecute(interaction),
});

async function onExecute(
  interaction: ChatInputCommandInteraction,
): Promise<void> {
  const chosenChannel = interaction.options.getChannel(channelOption.name);
  const message = interaction.options.getString(messageOption.name, true);

  if (interaction.context === InteractionContextType.Guild) {
    const channel = (chosenChannel ??
      interaction.channel) as GuildTextBasedChannel;

    if (!channel) {
      await replyEphemeral(interaction, "Could not find the text channel.");
      return;
    }

    await channel.send({ content: message });
    await replyEphemeral(interaction, `Message sent to ${channel.name}`);
    return;
  }

  if (chosenChannel) {
    await replyEphemeral(
      interaction,
      "Can't choose a channel outside of a server.",
    );
    return;
  }

  const channel = interaction.channel as DMChannel;

  if (channel) {
    await channel.send({ content: message });
    await replyEphemeral(interaction, `Message sent`);
  } else {
    await reply(interaction, message);
  }
}

export default command;
