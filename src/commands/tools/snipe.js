const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('Returns the most recently deleted message.'),
    async execute (interaction, client) {
        const msg = client.snipes.get(interaction.channelID)
        try {
            if (msg === undefined) 
                await interaction.reply("There's nothing to snipe!")
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: msg.author, 
                    iconURL: msg.member.user.displayAvatarURL({dynamic : true})
                })
                .setDescription(msg.content)
                .setTimestamp();
            
            await interaction.reply({
                embeds: [embed]
        });
        } catch (error) {
            console.error(error);
        }
        
    }
}