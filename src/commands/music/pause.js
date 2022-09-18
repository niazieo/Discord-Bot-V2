const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song."),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        queue.pause();
        await interaction.reply({content: ":pause_button: Song has been paused."})
    }
}