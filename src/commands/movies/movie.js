const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert({
      privateKey: process.env.private_key.replace(/\\n/g, '\n'),
      projectId: process.env.project_id,
      clientEmail: process.env.client_email
    }),
    databaseURL: "https://discord-bot-74d33.firebaseio.com"
  });
const db = admin.firestore();

module.exports = {
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
        ),
    async execute(interaction, client) {
        const { options, member, channel, guildId } = interaction;
        const movieName = options.getString("name");

        if (interaction.commandName === 'movie') {
            if (interaction.options.getSubcommand() === 'add') {
                if (movieName != null){
                    await db.collection(guildId).add({
                        Movie: movieName
                    })
                    await interaction.reply({
                        content: movieName + " has been added to the list!"
                    })
                } else {
                    await interaction.reply("Please enter a valid movie name.")
                }
            }
        
            if (interaction.options.getSubcommand() === 'remove') {
                const snapshot = await db.collection(guildId).where('Movie', "==", movieName).get();
                if (snapshot.empty) {
                    interaction.reply(movieName + " not found. Did you type it correctly?");
                }
                else{
                    snapshot.forEach(doc => {
                        doc.ref.delete();
                    })
                    interaction.reply(movieName + ' has been removed from the list!');
                }
            }

            if (interaction.options.getSubcommand() === 'list') {
                const movieList = [];
                const snapshot = db.collection(guildId).get();
                await snapshot.then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        movieList.push(doc.data().Movie);
                    })
                })

                if (!Array.isArray(movieList) || !movieList.length){
                    await interaction.reply("No movies in the list.")
                } 
                else {
                    const list = movieList.map((movie, i) => `${i+1}. ${movie}`).join("\n")
                    const movieEmbed = new EmbedBuilder()
                    .setTitle("Movie List")
                    .setDescription(list)
                    await interaction.reply({
                        embeds: [movieEmbed]
                    })
                }
            }
        }
    }
}