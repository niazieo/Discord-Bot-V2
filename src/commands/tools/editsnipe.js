const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editsnipe')
        .setDescription('Returns the most recently edited message.'),
    async execute (interaction, client) {
        const msg = client.editsnipes.get(interaction.channelId)
        if (!msg){
            interaction.reply("There's nothing to snipe!");
            return;
        } 
        const editedMsg = new EmbedBuilder()
            .setAuthor({
                name: msg.author, 
                iconURL: msg.member.user.displayAvatarURL({dynamic : true})
            })
            .setTimestamp(msg.createdTimestamp);
        if (msg.image)
            editedMsg.setImage(msg.image);
        if (msg.content)
            editedMsg.setDescription(msg.content);
            
        await interaction.reply({
            embeds: [editedMsg]
        });
    }
}