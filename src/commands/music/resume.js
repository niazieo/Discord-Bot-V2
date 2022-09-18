const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Skips to the next song"),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        queue.resume();
        await interaction.reply({content: ":play_pause: Song has been resumed."})
    }
}