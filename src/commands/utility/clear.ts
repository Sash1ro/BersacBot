import {
  ChatInputCommandInteraction,
  DMChannel,
  GuildTextBasedChannel,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  TextChannel,
} from "discord.js";

import { Command } from "../../structures/Command";
import { SuccessEmbed } from "../../structures/SuccessEmbed";
import { reply, replyEphemeral } from "../../utils/interactionUtils";

const amountOption = new SlashCommandIntegerOption()
  .setName("amount")
  .setDescription("amount of messages you want to delete (0-100)")
  .setRequired(false);

const command = new Command({
  name: "clear",
  description: "clear messages from this channel",
  context: [
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ],
  perms: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageMessages,
  ],
  builder: (data: SlashCommandBuilder) => data.addIntegerOption(amountOption),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onClear(interaction),
});

async function onClear(interaction: ChatInputCommandInteraction) {
  const channel = interaction.channel as GuildTextBasedChannel;
  const amount = interaction.options.getInteger(amountOption.name);

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!amount && channel instanceof TextChannel) {
    channel.clone();
    channel.delete();
    return;
  } else if (!amount) {
    replyEphemeral(
      interaction,
      "You need to provide the amount of messages (0-100)",
    );
    return;
  }

  const deleted = await channel.bulkDelete(amount, true);

  await replyEphemeral(
    interaction,
    `Deleted **${deleted.size}** message${deleted.size === 1 ? "" : "s"}.`,
  );
}

export default command;
