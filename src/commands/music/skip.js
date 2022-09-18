const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song"),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        if (!queue) {
            await interaction.reply({content: "There is nothing in the queue."});
            return;
        }

        queue.skip();
        await interaction.reply({content: ":track_next: Song has been skipped."})
    }
}