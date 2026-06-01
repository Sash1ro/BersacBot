import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandUserOption,
  SlashCommandNumberOption,
  EmbedBuilder,
  GuildMember,
  SlashCommandStringOption,
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

const reason = new SlashCommandStringOption()
  .setName("reason")
  .setDescription("The reason of the ban")
  .setRequired(false);

const command = new Command({
  name: "timeout",
  description: "Timeout a user",
  perms: ["ModerateMembers"],
  builder: (data: SlashCommandBuilder) =>
    data.addUserOption(target).addNumberOption(time).addStringOption(reason),
  execute: async (interaction: ChatInputCommandInteraction) =>
    onTt(interaction),
});

async function onTt(interaction: ChatInputCommandInteraction) {
  const user = interaction.options.getMember(target.name) as GuildMember | null;
  const duration = interaction.options.getNumber(time.name, true);
  const r = interaction.options.getString(reason.name, reason.required);

  if (!user) return;

  if (!user.moderatable) {
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [new ErrorEmbed("I don't have permission to timeout this user.")],
    });
    return;
  }

  const durationMs = duration * 60 * 1000;

  await user.timeout(durationMs, `Timed out by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle("Moderation")
    .setDescription(
      `${user.displayName} was timed out for ${duration} minute(s).`,
    )
    .setColor(command.primaryColor);

  if (r) {
    embed.addFields([{ name: "Reason : ", inline: true, value: r }]);
  }

  await interaction.reply({ embeds: [embed] });
}

export default command;
