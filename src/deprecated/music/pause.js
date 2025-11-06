import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song.");
export async function execute(interaction, client) {
    const VoiceChannel = interaction.member.voice.channel;
    if (!VoiceChannel)
        return interaction.reply({
            content: "You must be in a voice channel to use the music commands.",
            ephemeral: true,
        });

    const queue = await client.distube.getQueue(VoiceChannel);

    if (!queue) {
        await interaction.reply({ content: "There is nothing to pause!" });
        return;
    }

    try {
        queue.pause();
        await interaction.reply({ content: ":pause_button: Song has been paused." });
    } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \nCan't pause a song that isn't playing.`);
        await interaction.reply({
            embeds: [errorEmbed],
        });
    }
}