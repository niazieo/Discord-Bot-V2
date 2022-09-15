const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync("./src/commands");
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"))

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command: ${command.data.name} has been passed through the handler.`)
            }
        }

        const clientID = '757017980621029457';
        //const guildID = '941980140030787606';
        const rest = new REST({ version: '10' }).setToken(process.env.token);
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