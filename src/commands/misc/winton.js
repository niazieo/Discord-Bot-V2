import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('winton')
    .setDescription("It's what the people want!");
export async function execute(interaction, client) {
    await interaction.reply({
        content: 'https://tenor.com/view/winston-gif-27177732'
    });
}