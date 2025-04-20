require('dotenv').config();

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { TOKEN, openai_key } = process.env;
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
client.editsnipes = new Collection();

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
      'Authorization': `Bearer ${openai_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful discord chatbot.',
        },
        {
          role: 'user',
          content: message.content,
        },
      ],
    }),
  })

  const data = await response.json()
  var reply = data.choices[0].message.content.trim()
  // console.log("Reply:", reply)
  try {
    reply = reply.replace(/@everyone/g, '@\u200Beveryone').replace(/@here/g, '@\u200Bhere'); // Prevent pinging @everyone and @here by inserting a zero-width space
    if (reply.length > 2000) {
      reply = "The response is too long to send in a single message. Please try again with a shorter message.";
    }
    message.reply(reply);
  } catch (error) {
    console.error('Error: ', error);
    message.reply('There was an error sending the reply. \n`', error.message, '`');
  }
  clearInterval(sendTypingInterval); // Clear the interval when done
});

client.handleEvents();
client.handleCommands();
client.login(TOKEN);
