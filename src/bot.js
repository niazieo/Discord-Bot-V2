import dotenv from 'dotenv';
dotenv.config();

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

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

async function loadFunctions() {
    for (const folder of functionFolders) {
        const functionFiles = readdirSync(path.join('./src/functions', folder))
            .filter((file) => file.endsWith('.js'));
        for (const file of functionFiles) {
            const fullPath = path.resolve('./src/functions', folder, file);
            try {
                const mod = await import(pathToFileURL(fullPath).href);
                const fn = mod.default ?? mod;
                if (typeof fn === 'function') {
                    // module exports a function that takes the client
                    fn(client);
                } else if (typeof mod.init === 'function') {
                    mod.init(client);
                } else if (typeof mod.setup === 'function') {
                    mod.setup(client);
                } else {
                    console.warn(`No callable export found in ${fullPath}`);
                }
            } catch (err) {
                console.error(`Failed to import ${fullPath}:`, err);
            }
        }
    }
}

(async () => {
    await loadFunctions();

    if (typeof client.handleEvents === 'function') {
        await client.handleEvents();
    }
    if (typeof client.handleCommands === 'function') {
        await client.handleCommands();
    }

    client.login(process.env.TOKEN);
})();
