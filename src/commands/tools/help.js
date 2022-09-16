const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Return an embed with all the available commands'),
    async execute (interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription('Wow')
            .setColor(0x00ffff)
            .setURL(`https://www.youtube.com/watch?v=3xqG6Mq-cYw`)
            .addFields([
                {
                    name: `/coinflip`,
                    value: `Flips a coin (either H or T)`,
                    inline: true
                },
                {
                    name: `/women`,
                    value: `Sends a gif of women moment`,
                    inline: true
                },
                {
                    name: `/ping`,
                    value: `Returns latency and ping.`,
                    inline: true
                },
                {
                    name: `/snipe`,
                    value: `Returns the most recently deleted message in that channel.`,
                    inline: true
                }
            ]);
            await interaction.reply({
                embeds: [embed]
            });
    }
};