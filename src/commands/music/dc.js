const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dc")
    .setDescription("Disconnects the bot from the voice channel."),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        queue.stop();
        await interaction.reply({content: "Goodbye!"})
    }
}