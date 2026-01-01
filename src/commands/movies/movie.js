import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import admin from "firebase-admin";

// Initialize Firebase Admin only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            privateKey: process.env.private_key.replace(/\\n/g, '\n'),
            projectId: process.env.project_id,
            clientEmail: process.env.client_email
        }),
        databaseURL: "https://discord-bot-74d33.firebaseio.com"
    });
}

const db = admin.firestore();

export default {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('description')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('add')
                .setDescription('Add a movie to the list.')
                .addStringOption((option) =>
                    option.setName('name').setDescription('Name of movie').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove a movie from the list.')
                .addStringOption((option) =>
                    option.setName('name').setDescription('Name of movie').setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('list')
                .setDescription('View the list of movies added.')
                .addBooleanOption((option) =>
                    option.setName('old').setDescription('Old list of movies').setRequired(false)
                )
        ),
    async execute(interaction, client) {
        const { options, member, guild } = interaction;
        const movieName = options.getString("name");
        const old = options.getBoolean("old");
        const colId = "movie-" + guild.name;

        if (interaction.commandName === 'movie') {
            if (interaction.options.getSubcommand() === 'add') {
                if (movieName != null) {
                    // Add movie logic
                    await db.collection(colId).add({
                        Movie: movieName,
                        AddedBy: member.user.tag,
                        Timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                    await interaction.reply(`Added "${movieName}" to the movie list!`);
                } else {
                    await interaction.reply('Please provide a movie name.');
                }
            }
        
            if (interaction.options.getSubcommand() === 'remove') {
                const snapshot = await db.collection(colId).where('Movie', "==", movieName).get();
                if (snapshot.empty) {
                    await interaction.reply(`"${movieName}" not found in the list.`);
                } else {
                    snapshot.forEach(async (doc) => {
                        await doc.ref.delete();
                    });
                    await interaction.reply(`Removed "${movieName}" from the movie list!`);
                }
            }

            if (interaction.options.getSubcommand() === 'list') {
                const movieList = [];
                var snapshot = await db.collection(colId).get();
                if (old) {
                    snapshot = await db.collection(guild.id).get();
                }
                
                if (snapshot.empty) {
                    await interaction.reply('No movies in the list.');
                    return;
                }
                
                snapshot.forEach((doc) => {
                    movieList.push(doc.data().Movie);
                });
                
                const embed = new EmbedBuilder()
                    .setTitle('Movie List')
                    .setDescription(movieList.join('\n') || 'No movies added yet')
                    .setColor(0x00ffff);
                
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}