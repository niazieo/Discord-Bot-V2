import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('winton')
        .setDescription("It's what the people want!"),
    async execute (interaction, client) {
        await interaction.reply({
            content: 'https://tenor.com/view/winston-gif-27177732'
        })
    }
}