import { Ollama } from 'ollama';

const ollama = new Ollama({ host: process.env.OLLAMA_HOST, port: process.env.OLLAMA_PORT });
const modelName = process.env.MODEL_NAME || 'qwen3';

export default {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.mentions.everyone) return;
        if (!message.mentions.has(client.user)) return;
        if (message.channel.permissionsFor(message.client.user).has("SendMessages") === false) {
          return message.react("❌").catch(console.error);
        }
      
        await message.channel.sendTyping();
        const sendTypingInterval = setInterval(() => {
          message.channel.sendTyping();
        }, 5000); // Send typing every 5 seconds

        const response = await ollama.chat({
          model: modelName,
          messages: [
            {
              role: 'system',
              content: 'Your name is Noctua, a general all purpose AI assistant. You are witty and are great with insults. Respond in a natural way. Reply in 1500 characters or fewer.',
            },
            {
              role: 'user',
              content: message.content,
            },
          ],
        });

        // console.log("AI Response Object:", response);
        var reply = response.message.content;
        // console.log("Reply:", reply);

        try {
          if (reply.length > 2000) {
            reply = "The response is too long to send in a single message. Please try again with a shorter message.";
          }
          reply = reply.replace(/@everyone/g, '@\u200Beveryone').replace(/@here/g, '@\u200Bhere'); // Prevent pinging @everyone and @here
          reply = reply.replace(/<@!?(\d+)>/g, (match, userId) => {
            const user = message.guild.members.cache.get(userId);
            return user ? `@${user.displayName}` : match; // Replace with the user's display name
          });
          reply = reply.replace(/<@&!?(\d+)>/g, (match, roleId) => {
            const role = message.guild.roles.cache.get(roleId);
            return role ? `@${role.name}` : match; // Replace with the role name
          });
          message.reply(reply);
        } catch (error) {
          console.error('Error: ', error);
          message.reply('There was an error sending the reply. \n`' + error.message + '`');
        }
        clearInterval(sendTypingInterval); // Clear the interval when done
    }
};