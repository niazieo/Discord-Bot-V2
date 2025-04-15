const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
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
            await interaction.reply({content: "There is nothing to resume!"});
            return;
        }
        try {
            queue.resume();
            await interaction.reply({content: ":play_pause: Song has been resumed."})
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \nUnable to resume a song that isn't paused.`);
            await interaction.reply({
                embeds: [errorEmbed],
            });
        }
        
    }
}