const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Returns the most recently deleted message.'),
    async execute (interaction, client) {
        const msg = client.snipes.get(interaction.channelID)
        if (!msg){
            interaction.reply("There's nothing to snipe!");
            return;
        } 
        const deletedMsg = new EmbedBuilder()
            .setAuthor({
                name: msg.author, 
                iconURL: msg.member.user.displayAvatarURL({dynamic : true})
            })
            .setTimestamp(msg.createdTimestamp);
        if (msg.image)
            deletedMsg.setImage(msg.image);
        if (msg.content)
            deletedMsg.setDescription(msg.content);
            
        await interaction.reply({
            embeds: [deletedMsg]
        });
    }
}