import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("dc")
    .setDescription("Disconnects the bot from the voice channel.");
export async function execute(interaction, client) {
    const VoiceChannel = interaction.member.voice.channel;
    if (!VoiceChannel)
        return interaction.reply({
            content: "You must be in a voice channel to use the music commands.",
            ephemeral: true,
        });
    const queue = await client.distube.getQueue(VoiceChannel);

    try {
        client.distube.stop(VoiceChannel);
        await interaction.reply({ content: "Goodbye!" });
    } catch (e) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \n`);
        await interaction.reply({
            embeds: [errorEmbed],
        });
    }

}