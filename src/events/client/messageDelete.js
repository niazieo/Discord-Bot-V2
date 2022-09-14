const { Message } = require("discord.js");

module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (message.partial) return;

        client.snipes.set(message.channelId, {
            content: message.content,
            author: message.author.tag,
            member: message.member,
            image: (message.attachments.first()) ? (message.attachments.first().proxyURL) : (null),
            createdTimestamp: message.createdTimestamp
        })
        
        //console.log(client.snipes.get(message.channelId))
    }
};