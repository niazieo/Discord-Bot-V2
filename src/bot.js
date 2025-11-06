require('dotenv').config();

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new Collection();
client.commandArray = [];
client.snipes = new Collection();
client.editsnipes = new Collection();

const functionFolders = readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(process.env.TOKEN);
