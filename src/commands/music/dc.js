const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("dc")
    .setDescription("Disconnects the bot from the voice channel."),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        if (!VoiceChannel)
            return interaction.reply({
                content: "You must be in a voice channel to use the music commands.",
                ephemeral: true,
            });
        const queue = await client.distube.getQueue(VoiceChannel);

        queue.stop();
        await interaction.reply({content: "Goodbye!"})
    }
}