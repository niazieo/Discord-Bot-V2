require('dotenv').config();

const { token } = process.env;
const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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

const admin = require("firebase-admin");
//const serviceAccount = require("./firebase.json");
const {private_key} = JSON.parse(process.env.FIREBASE_PRIVATE_KEY)

admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": process.env.FIREBASE_PROJECT_ID,
    private_key,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://discord-bot-74d33.firebaseio.com"
});

const db = admin.firestore();

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

// Distube events
client.distube
  .on("playSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x00ff00)
          .setDescription(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
          ),
      ],
    })
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xffa500)
          .setDescription(
            `Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue by ${song.user}`
          ),
      ],
    })
  )
  .on("addList", (queue, playlist) =>
    queue.textChannel.send({
      embeds: [
        new EmbedBuilder().setDescription(
          `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`
        ),
      ],
    })
  )
  .on("error", (channel, e) => {
    if (channel)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(
              `An error encountered: ${e.toString().slice(0, 1974)}`
            ),
        ],
      });
    else console.error(e);
  })
  .on("empty", (channel) =>
    channel.send("Voice channel is empty! Leaving the channel...")
  )
  .on("searchNoResult", (message, query) =>
    message.channel.send({
      embeds: [
        new EmbedBuilder().setDescription(`No result found for \`${query}\`!`),
      ],
    })
  )
  .on("finish", (queue) => queue.textChannel.send("Finished!"));

client.handleEvents();
client.handleCommands();
client.login(token);