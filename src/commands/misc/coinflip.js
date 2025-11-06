import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.');
export async function execute(interaction, client) {
    const coin = ['H', 'T'];
    const randomSide = coin[Math.floor(Math.random() * coin.length)];

    await interaction.reply(randomSide);
}