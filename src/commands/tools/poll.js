const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("create a poll")
    .addSubcommand((subcommand) =>
      subcommand
        .setName('yn')
        .setDescription(
          `A poll where the only options available are 'Yes' or 'No'`
        )
        .addStringOption((option) =>
          option
            .setName("question")
            .setDescription("a yes or no question")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const { options, member, channel } = interaction;

    const message = await interaction.reply({
        embeds: [new EmbedBuilder().setTitle(options.getString("question"))],
        fetchReply: true
    })

    message.react("👍")
    message.react("👎")
  },
};
