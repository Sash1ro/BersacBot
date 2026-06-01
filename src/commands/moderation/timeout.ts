import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  SlashCommandNumberOption,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { Command } from "../../structures/Command";
import { ErrorEmbed } from "../../structures/ErrorEmbed";

const target = new SlashCommandUserOption()
  .setName("target")
  .setDescription("The user you want to timeout")
  .setRequired(true);

const time = new SlashCommandNumberOption()
  .setName("time")
  .setDescription("Timeout duration in minutes")
  .setRequired(true);

const command = new Command({
  name: "timeout",
  description: "Timeout a user",
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addNumberOption(time),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onTt(interaction),
});

async function onTt(interaction: ChatInputCommandInteraction) {
  const member = interaction.options.getMember(
    target.name,
  ) as GuildMember | null;
  const duration = interaction.options.getNumber(time.name, true);

  if (!member) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("Could not find that user in this server.")],
    });
    return;
  }

  if (!member.moderatable) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("I don't have permission to timeout this user.")],
    });
    return;
  }

  const durationMs = duration * 60 * 1000;

  await member.timeout(durationMs, `Timed out by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle("Moderation")
    .setDescription(
      `${member.displayName} was timed out for ${duration} minute(s).`,
    )
    .setColor(command.primaryColor);

  await interaction.reply({ flags: MessageFlags.Ephemeral, embeds: [embed] });
}

export default command;
