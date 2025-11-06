import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Returns the most recently deleted message.');
export async function execute(interaction, client) {
    const msg = client.snipes.get(interaction.channelId);
    if (!msg) {
        interaction.reply("There's nothing to snipe!");
        return;
    }
    const deletedMsg = new EmbedBuilder()
        .setAuthor({
            name: msg.author,
            iconURL: msg.member.user.displayAvatarURL({ dynamic: true })
        })
        .setTimestamp(msg.createdTimestamp);
    if (msg.image)
        deletedMsg.setImage(msg.image);
    if (msg.content)
        deletedMsg.setDescription(msg.content);

    await interaction.reply({
        embeds: [deletedMsg]
    });
}