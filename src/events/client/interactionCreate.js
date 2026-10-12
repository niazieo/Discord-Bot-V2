export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const { commands } = client;
        const { commandName } = interaction;
        const command = commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error('Command execution failed:', error);

            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: 'Something went wrong while executing this command...',
                }).catch(() => null);
                return;
            }

            await interaction.reply({
                content: 'Something went wrong while executing this command...',
                ephemeral: true,
            }).catch(() => null);
        }
    },
};