import dotenv from "dotenv";
import { registerCmds } from "./utils/commandsHandler";
import { registerEvent } from "./utils/eventsHandler";
import { BotClient } from "./structures/BotClient";

dotenv.config();

const client = new BotClient();

registerCmds(client);
registerEvent(client);

client.login(process.env.TOKEN);
