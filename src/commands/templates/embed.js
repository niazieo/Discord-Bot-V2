const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Return an embed!'),
    async execute (interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('This is an EMBED!')
            .setDescription('Wow')
            .setColor(0x00ffff)
            .setImage(client.user.displayAvatarURL()) //Big image
            .setThumbnail(client.user.displayAvatarURL()) //Small image
            .setTimestamp()
            .setAuthor({
                url: `https://www.youtube.com/watch?v=3xqG6Mq-cYw`,
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag
            })
            .setURL(`https://www.youtube.com/watch?v=3xqG6Mq-cYw`)
            .addFields([
                {
                    name: `Name 1`,
                    value: `Value 1`,
                    inline: true
                },
                {
                    name: `Name 2`,
                    value: `Value 2`,
                    inline: true
                }
            ]);
            await interaction.reply({
                embeds: [embed]
            });
    }
};