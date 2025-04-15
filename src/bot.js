require('dotenv').config();

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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

const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    if (folder === "music") continue; // ignore music folder since it is deprecated
    const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}
/*
The below code is everything needed to integrate OpenRouter models into the bot.
Uncomment it to use it.
It is currently commented out to because it kept @everyone and @here in the responses.
*/
// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;
//   if (!message.mentions.has(client.user)) return;

//   await message.channel.sendTyping();
//   const sendTypingInterval = setInterval(() => {
//     message.channel.sendTyping();
//   }, 3000); // Send typing every 3 seconds

//   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${process.env.openai_key}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'google/gemma-2-9b-it:free',
//       messages: [
//         {
//           role: 'system',
//           content: 'You are not allowed to respond with @here or @everyone. You are a helpful assistant',
//         },
//         {
//           role: 'user',
//           content: message.content,
//         },
//       ],
//     }),
//   }).catch((error) => {
//     console.error('OpenAI Error: ', error);
//     message.reply('There was an error processing your request.');
//     clearInterval(sendTypingInterval); // Clear the interval on error
//   });

//   const data = await response.json();

//   clearInterval(sendTypingInterval); // Clear the interval when the response is received
//   if (!data.choices || !data.choices[0]) {
//     return message.reply('No response from the model.');
//   }
  
//   const reply = data.choices[0].message.content.trim();
//   message.reply(reply);
// });

client.handleEvents();
client.handleCommands();
client.login(process.env.TOKEN);
