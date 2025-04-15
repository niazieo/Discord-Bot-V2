require('dotenv').config();

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
// const { DisTube } = require("distube");
// const { SpotifyPlugin } = require("@distube/spotify");
// const { SoundCloudPlugin } = require("@distube/soundcloud")
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

/* DEPRECATED
client.distube = new DisTube(client, {
    searchSongs: 1,
    leaveOnStop: true,
    leaveOnEmpty: true,
    leaveOnFinish: false,
    emitNewSongOnly: true,
    nsfw: true,
    emitAddListWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
});
*/

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    if (folder === "music") continue; // ignore music folder since it is deprecated
    const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  await message.channel.sendTyping();
  const sendTypingInterval = setInterval(() => {
    message.channel.sendTyping();
  }, 3000); // Send typing every 3 seconds

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.openai_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it:free',
      messages: [
        {
          role: 'system',
          content: 'You are not allowed to respond with @here or @everyone. You are a helpful discord chatbot.',
        },
        {
          role: 'user',
          content: message.content,
        },
      ],
    }),
  }).catch((error) => {
    console.error('OpenAI Error: ', error);
    message.reply('There was an error processing your request.');
    clearInterval(sendTypingInterval); // Clear the interval on error
  });

  const data = await response.json().catch((error) => {
    console.error('OpenAI Error: ', error);
    message.reply('There was an error processing your request.');
    clearInterval(sendTypingInterval); // Clear the interval on error
  });
      
  clearInterval(sendTypingInterval); // Clear the interval when the response is received
  const reply = data.choices[0].message.content.trim();
  message.reply(reply);
});
/* DEPCRECATED

Distube events
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
  .on("finish", (queue) => {
    queue.textChannel.send("Finished!")
  });
*/

client.handleEvents();
client.handleCommands();
client.login(process.env.TOKEN);
