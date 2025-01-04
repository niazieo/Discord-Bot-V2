/*
Import things as needed
*/
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const db = admin.firestore();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('description')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('warning')
                .setDescription('Warn the user.')
                .addStringOption((option) =>
                    option.setName('user').setDescription('User to warn').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('View the list of ban warnings added.')
        ),
    async execute(interaction, client) {
        const { options, member, channel, guildId } = interaction;
        const user = options.getString("user");

        if (interaction.commandName === 'ban') {

            if (interaction.options.getSubcommand() === 'warning') {
                if (user != null){
                    await db.collection("ban"+guildId).doc(user).update ({
                        Warnings: FieldValue.increment(1)
                    })
                    .catch((error) => {
                        db.collection("ban"+guildId).doc(user).set({
                            Warnings: FieldValue.increment(1)
                        })     
                    })
                    await interaction.reply({
                        content: "Ban warning added for " + user
                    })
                } else {
                    await interaction.reply("Please enter a user.")
                }
            }
            if (interaction.options.getSubcommand() === 'list') {
                const warnList = [];
                const snapshot = db.collection("ban"+guildId).get();
                await snapshot.then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        warnList.push([doc.id, doc.data().Warnings]);
                    })
                })
                if (!Array.isArray(warnList) || !warnList.length){
                    await interaction.reply("Nobody has been warned yet!")
                } 
                else {
                    const list = warnList.map((user) => `${user[0]}: ${user[1]}/3`).join("\n")
                    const warnEmbed = new EmbedBuilder()
                    .setTitle("Ban Warnings List")
                    .setDescription(list)
                    await interaction.reply({
                        embeds: [warnEmbed]
                    })
                }
                
            }
        }
    }
}