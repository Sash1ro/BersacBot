import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBooleanOption,
  EmbedBuilder,
  inlineCode,
} from "discord.js";

import { Command } from "../../structures/Command";

const ephemeralOption = new SlashCommandBooleanOption()
  .setName("ephemeral")
  .setDescription(
    "Whether the response should be ephemeral (showed only to you)",
  )
  .setRequired(false);

const command: Command = new Command({
  name: "ping",
  description: "Return the bot latency",

  builder: (data) => data.addBooleanOption(ephemeralOption),

  execute: async (interaction: ChatInputCommandInteraction) =>
    onPing(interaction),
});

async function onPing(interaction: ChatInputCommandInteraction) {
  const start = Date.now();

  const isEphemeral =
    interaction.options.getBoolean(
      ephemeralOption.name,
      ephemeralOption.required,
    ) ?? false;

  await interaction.reply({
    content: "Pinging....",
    flags: isEphemeral ? MessageFlags.Ephemeral : undefined,
  });

  const roundtrip = Date.now() - start;
  const websocket = interaction.client.ws.ping;

  const embed = new EmbedBuilder();
  embed.setTitle("Latency");
  embed.setColor([63, 55, 201]);

  embed.addFields(
    {
      name: "Message",
      value: inlineCode(roundtrip.toString() + "ms"),
      inline: true,
    },
    {
      name: "Bot",
      value: inlineCode(websocket.toString() + "ms"),
      inline: true,
    },
  );

  embed.setThumbnail(interaction.client.user.avatarURL());

  await interaction.editReply({
    embeds: [embed],
  });
}

export default command;
