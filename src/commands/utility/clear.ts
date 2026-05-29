import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  TextChannel,
} from "discord.js";
import { Command } from "../../structures/Command";

const amountOption = new SlashCommandIntegerOption()
  .setName("amount")
  .setDescription("amount of messages you want to delete (0-100)")
  .setRequired(false);

const command = new Command({
  name: "clear",
  description: "clear messages from this channel",
  builder: (data: SlashCommandBuilder) => data.addIntegerOption(amountOption),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onClear(interaction),
});

async function onClear(interaction: ChatInputCommandInteraction) {
  const channel = interaction.channel as TextChannel;
  const amount = interaction.options.getInteger(amountOption.name);

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  if (!amount) {
    channel.clone();
    channel.delete();
    return;
  }

  const deleted = await channel.bulkDelete(amount, true);

  await interaction.editReply(
    `Deleted **${deleted.size}** message${deleted.size === 1 ? "" : "s"}.`,
  );
}

export default command;
