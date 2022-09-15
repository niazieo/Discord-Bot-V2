const fs = require('fs');
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin'),
    async execute(interaction, client) {
        const coin = ['H', 'T'];
        const randomSide = coin[Math.floor(Math.random() * coin.length)];

        await interaction.reply(randomSide)
        
    }
}