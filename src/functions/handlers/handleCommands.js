import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default (client) => {
    client.handleCommands = async () => {
        const commandFolders = readdirSync("./src/commands");
        for (const folder of commandFolders) {
            if (folder === "music") continue; // ignore music folder since it is deprecated
            const commandFiles = readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const fullPath = path.resolve(`./src/commands/${folder}/${file}`);
                const mod = await import(pathToFileURL(fullPath).href);
                const command = mod.default ?? mod;
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command: ${command.data.name} has been passed through the handler.`);
            }
        }

        const clientID = process.env.CLIENTID;
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');

            //Use applicationCommands for no server specifity
            //Use applicationGuildCommands for server specifity
            await rest.put(Routes.applicationCommands(clientID), { 
                body: client.commandArray, 
            });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    };
};