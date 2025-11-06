import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('women')
    .setDescription('Sends a gif of a woman acting surprised after hammering a hole in the wall');
export async function execute(interaction, client) {
    await interaction.reply({
        content: 'https://tenor.com/oFd6.gif \nAm I right?'
    });
}