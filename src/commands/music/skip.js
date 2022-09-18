const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song"),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        if (!VoiceChannel)
            return interaction.reply({
                content: "You must be in a voice channel to use the music commands.",
                ephemeral: true,
            });
            
        const queue = await client.distube.getQueue(VoiceChannel);

        if (!queue) {
            await interaction.reply({content: "There is nothing in the queue."});
            return;
        }

        queue.skip();
        await interaction.reply({content: ":track_next: Song has been skipped."})
    }
}