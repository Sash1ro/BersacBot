import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command } from "./structures/Command";
import dotenv from "dotenv";
import { registerCmds } from "./utils/commandsHandler";
import { registerEvent } from "./utils/eventsHandler";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection<string, Command>();

registerCmds(client);
registerEvent(client);

client.login(process.env.TOKEN);
