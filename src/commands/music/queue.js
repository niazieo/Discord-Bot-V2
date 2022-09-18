const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Skips to the next song"),
    
    async execute(interaction, client) {
        const VoiceChannel = interaction.member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

        if (!queue) return interaction.reply({ content: "There is no queue." });

        try {
            const queueEmbed = new EmbedBuilder()
            .setColor(0xa020f0)
            .setDescription(`${queue.songs.map((song, id) =>
                    `\n**${id + 1}**. ${song.name} = \`${song.formattedDuration}\``)}`);

            await interaction.reply({
            embeds: [queueEmbed]
            })
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription(`${e} \nThe queue is probably too large to display right now. \n I will try to fix this eventually.`);
            await interaction.reply({
                embeds: [errorEmbed],
            });
        }

    }
}