import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBooleanOption,
} from "discord.js";

import { Command } from "../../structures/Command";

const inv = new SlashCommandBooleanOption()
  .setName("ephemeral")
  .setDescription(
    "Whether the response should be ephemeral (showed only to you)",
  )
  .setRequired(false);

const command: Command = new Command({
  name: "ping",
  description: "Return the bot latency",

  builder: (data) => data.addBooleanOption(inv),

  execute: async (interaction: ChatInputCommandInteraction) =>
    onPing(interaction),
});

async function onPing(interaction: ChatInputCommandInteraction) {
  const start = Date.now();

  const isEphemeral = interaction.options.getBoolean(inv.name, false) ?? false;

  await interaction.reply({
    withResponse: true,
    content: "Pinging....",
    flags: isEphemeral ? MessageFlags.Ephemeral : undefined,
  });

  const roundtrip = Date.now() - start;
  const websocket = interaction.client.ws.ping;

  await interaction.editReply(
    `🏓 Pong!\n📡 Roundtrip: \`${roundtrip}ms\`\n💓 Websocket: \`${websocket}ms\``,
  );
}

export default command;
