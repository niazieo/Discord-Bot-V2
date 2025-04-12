/*
Import things as needed
*/
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
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
            const { options, member, guildId } = interaction;
            const user = options.getUser("user");
            const reason = options.getString("reason");
        
            if (interaction.commandName !== 'ban') return;
        
            const subcommand = options.getSubcommand();
        
            switch (subcommand) {
                case 'warning':
                    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        await interaction.reply({
                            content: "You do not have permission to use this command.",
                            ephemeral: true
                        });
                        return;
                    }
        
                    try {
                        await db.collection("ban" + guildId).doc(user.toString()).update({
                            Warnings: FieldValue.increment(1),
                            Reason: FieldValue.arrayUnion(reason)
                        });
                    } catch (error) {
                        await db.collection("ban" + guildId).doc(user.toString()).set({
                            Warnings: FieldValue.increment(1),
                            Reason: FieldValue.arrayUnion(reason)
                        });
                    }
        
                    const banwarnEmbed = new EmbedBuilder()
                        .setDescription("### Ban warning added for " + user.toString())
                        .setFields([{ name: "Reason", value: reason.toString() }])
                        .setColor("Red");
        
                    await interaction.reply({ embeds: [banwarnEmbed] });
                    break;
        
                case 'list':
                    if (user) {
                        const snapshot = await db.collection("ban" + guildId).doc(user.toString()).get();
        
                        if (!snapshot.exists) {
                            await interaction.reply({
                                content: `No warnings found for ${user.toString()}.`,
                                ephemeral: true
                            });
                            return;
                        }
        
                        const reasons = snapshot.data().Reason || [];
                        const list = reasons.map((r, i) => `${i + 1}: ${r}`).join("\n");
        
                        const reasonEmbed = new EmbedBuilder()
                            .setDescription(`### Ban Warning Reasons for ${user.toString()}\n${list}`)
                            .setColor("Orange");
        
                        await interaction.deferReply();
                        await interaction.editReply({ embeds: [reasonEmbed] });
        
                    } else {
                        try {
                            const snapshot = await db.collection("ban" + guildId).get();
        
                            if (snapshot.empty) {
                                throw new Error("No warnings");
                            }
        
                            const warnList = snapshot.docs.map(doc => {
                                const data = doc.data();
                                return `${doc.id}: ${data.Warnings}/3`;
                            });
        
                            const warnEmbed = new EmbedBuilder()
                                .setTitle("Ban Warnings List")
                                .setDescription(warnList.join("\n"))
                                .setColor("Yellow");
        
                            await interaction.deferReply();
                            await interaction.editReply({ embeds: [warnEmbed] });
        
                        } catch (error) {
                            await interaction.reply({
                                content: "No warnings have been issued to anyone yet!",
                                ephemeral: true
                            });
                        }
                    }
                    break;
        
                default:
                    await interaction.reply({
                        content: "Unknown subcommand. What you sayin' bruv",
                        ephemeral: true
                    });
                    break;
            }
        }
        
}