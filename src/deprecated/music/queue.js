import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays the list of songs that have been added to the queue.");
export async function execute(interaction, client) {
    const VoiceChannel = interaction.member.voice.channel;

    if (!VoiceChannel)
        return interaction.reply({
            content: "You must be in a voice channel to use the music commands.",
            ephemeral: true,
        });

    const queue = await client.distube.getQueue(VoiceChannel);

    if (!queue) return interaction.reply({ content: "There is no queue." });

    try {
        const queueEmbed = new EmbedBuilder()
            .setColor(0xa020f0)
            .setDescription(`${queue.songs.map((song, id) => `\n**${id + 1}**. ${song.name} = \`${song.formattedDuration}\``)}`);

        await interaction.reply({
            embeds: [queueEmbed]
        });
    } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \nThe queue is probably too large to display right now. \n I will try to fix this eventually.`);
        await interaction.reply({
            embeds: [errorEmbed],
        });
    }

}