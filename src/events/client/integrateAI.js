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
        }, 3000); // Send typing every 3 seconds
      
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.openai_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-20b:free',
            messages: [
              {
                role: 'system',
                content: 'Reply in 1500 characters or fewer.',
              },
              {
                role: 'user',
                content: message.content,
              },
            ],
          }),
        })
      
        const data = await response.json()
        // console.log("AI Response Data:", data)
        var reply = data.choices[0].message.content.trim()
        // console.log("Reply:", reply)
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
          message.reply('There was an error sending the reply. \n`', error.message, '`');
        }
        clearInterval(sendTypingInterval); // Clear the interval when done
    }
};