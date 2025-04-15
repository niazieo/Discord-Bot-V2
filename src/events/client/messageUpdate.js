const { Message } = require("discord.js");

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (oldMessage === newMessage) return;
        // console.log('Old message:', oldMessage.content);
        // console.log('New message:', newMessage.content);
        client.editsnipes.set(newMessage.channelId, {
            content: oldMessage.content,
            author: oldMessage.author.tag,
            member: oldMessage.member,
            image: (oldMessage.attachments.first()) ? (oldMessage.attachments.first().proxyURL) : (null),
            createdTimestamp: newMessage.editedTimestamp
        })
    }
};