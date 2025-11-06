import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Return my ping!');
export async function execute(interaction, client) {
    const message = await interaction.deferReply({
        fetchReply: true
    });

    const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
    await interaction.editReply({
        content: newMessage
    });
}