import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song");
export async function execute(interaction, client) {
    const VoiceChannel = interaction.member.voice.channel;
    if (!VoiceChannel)
        return interaction.reply({
            content: "You must be in a voice channel to use the music commands.",
            ephemeral: true,
        });

    const queue = await client.distube.getQueue(VoiceChannel);

    if (!queue) {
        await interaction.reply({ content: "There is nothing in the queue." });
        return;
    }
    try {
        await queue.skip();
        await interaction.reply({ content: ":track_next: Song has been skipped." });
    } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \nNothing to skip to!`);
        await interaction.reply({
            embeds: [errorEmbed],
        });
    }
}