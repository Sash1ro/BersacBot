import { Client } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

import { Command } from "../structures/Command";

const root = path.join(__dirname, "..");

const folderPath = path.join(root, "commands");
const commandsFolders = fs.readdirSync(folderPath);

export function registerCmds(client: Client) {
  commandsFolders.forEach((folder) => {
    const commandsPath = path.join(folderPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    commandFiles.forEach((file) => {
      const filePath = path.join(commandsPath, file);
      const command: Command = require(filePath).default;
      if (command instanceof Command)
        client.commands.set(command.data.name, command);
      else
        console.warn(
          `The command at ${filePath} is not a valid Command instance.`,
        );
    });
  });
}
