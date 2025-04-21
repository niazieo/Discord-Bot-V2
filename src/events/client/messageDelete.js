module.exports = {
    name: 'messageDelete',
    async execute(message, client) {
        if (message.partial) return;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

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