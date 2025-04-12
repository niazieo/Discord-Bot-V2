/*
Import things as needed
*/
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require("discord.js");
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
                .addUserOption((option) =>
                    option.setName('user').setDescription('User to warn').setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('reason').setDescription('Reason for warning').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('View the list of ban warnings added.')
                .addUserOption((option) =>
                    option.setName('user').setDescription('User to view the list of warnings').setRequired(false)
                )
        ),
    async execute(interaction, client) {
        const { options, member, channel, guildId } = interaction;
        const user = options.getUser("user");
        const reason = options.getString("reason");

        if (interaction.commandName === 'ban') {

            if (interaction.options.getSubcommand() === 'warning' && interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
                await db.collection("ban"+guildId).doc(user.toString()).update ({
                    Warnings: FieldValue.increment(1),
                    Reason: FieldValue.arrayUnion(reason) 
                })
                .catch((error) => {
                    db.collection("ban"+guildId).doc(user.toString()).set({
                        Warnings: FieldValue.increment(1),
                        Reason: FieldValue.arrayUnion(reason)
                    })     
                })
                const banwarnEmbed = new EmbedBuilder()
                .setDescription("### Ban warning added for " + user.toString())
                .setFields([
                    { name: "Reason", value: reason.toString()},
                ])
                .setColor("Orange")
                await interaction.reply({
                    embeds: [banwarnEmbed]
                })

            } else if (interaction.options.getSubcommand() === 'warning' && !interaction.member.permissions.has([PermissionsBitField.Flags.Administrator])) {
                await interaction.reply({
                    content: "You do not have permission to use this command.",
                    ephemeral: true
                })
            }

            if (interaction.options.getSubcommand() === 'list') {
                if (user) {
                    const snapshot = db.collection("ban"+guildId).doc(user.toString()).get();
                    if (!(await snapshot).exists) {
                        await interaction.reply({
                            content: "No warnings found for " + user.toString() + ".",
                            ephemeral: true
                        })
                        return;
                    } else {
                        var reasons;
                        await snapshot.then(querySnapshot => {
                            reasons = querySnapshot.data().Reason;
                        })
                        const list = reasons.map((reason,i) => `${i+1}: ${reason}`).join("\n")
                        const reasonEmbed = new EmbedBuilder()
                        .setDescription("### Ban Warning Reasons for " + user.toString() + "\n" + list)
                        .setColor("Red")
                        await interaction.deferReply({
                            content: "Fetching ban warning reason list...",
                        })
                        await interaction.editReply({
                            embeds: [reasonEmbed]
                        })
                    }
                    
                } else {
                    const warnList = [];
                    const snapshot = db.collection("ban"+guildId).get();
                    await snapshot.then(querySnapshot => {
                        querySnapshot.docs.forEach(doc => {
                            warnList.push([doc.id, doc.data().Warnings]);
                        })
                    })
                    const list = warnList.map((user) => `${user[0]}: ${user[1]}/3`).join("\n")
                    const warnEmbed = new EmbedBuilder()
                    .setTitle("Ban Warnings List")
                    .setDescription(list)
                    .setColor("Yellow")
                    await interaction.deferReply({
                        content: "Fetching ban warning list...",
                    })
                    await interaction.editReply({
                        embeds: [warnEmbed]
                    })
                }
                
            }

            
        }
    }
}