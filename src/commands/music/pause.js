const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song."),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        if (!VoiceChannel)
            return interaction.reply({
                content: "You must be in a voice channel to use the music commands.",
                ephemeral: true,
            });

        const queue = await client.distube.getQueue(VoiceChannel);

        if (!queue) {
            await interaction.reply({content: "There is nothing to pause!"});
            return;
        }
        
        queue.pause();
        await interaction.reply({content: ":pause_button: Song has been paused."})
    }
}