import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Command } from './structures/Command';

dotenv.config();

const commands: object[] = [];

const folderPath = path.join(__dirname, 'commands');
const commandsFolders = fs.readdirSync(folderPath);

commandsFolders.forEach((folder) => {
  const commandsPath = path.join(folderPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  commandFiles.forEach(file => {
    const filePath = path.join(commandsPath, file);
    const command: Command = require(filePath).default;
    if(command instanceof Command) 
      commands.push(command.data.toJSON());
    else 
      console.warn(`The command at ${filePath} is not a valid Command instance.`);
  });
});

const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log(`Refreshing ${commands.length} application (/) commands...`);

    await rest.put(
      Routes.applicationCommands(process.env.ID!),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();