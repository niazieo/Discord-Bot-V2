require('dotenv').config();

const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const fs = require('fs');

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
client.distube = new DisTube(client, {
    leaveOnStop: true,
    emitNewSongOnly: true,
    emitAddListWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()],
});

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);