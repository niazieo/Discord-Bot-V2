const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('women')
        .setDescription('Sends a gif of a woman acting surprised after hammering a hole in the wall'),
    async execute (interaction, client) {
        await interaction.reply({
            content: 'https://tenor.com/oFd6.gif \nAm I right?'
        })
    }
}