const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Return an embed with all the available commands')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('Specify which command to get help for')
                .setRequired(false)
        ),

    async execute (interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle('Help Menu')
        .setDescription('List of available commands')
        .setColor(0x00ffff)
        .setURL(`https://www.youtube.com/watch?v=3xqG6Mq-cYw`)
        const commandFolders = fs.readdirSync("./src/commands");
        const commands = []
        const subcommand = interaction.options.getString('command');

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"))
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.push(command);
            }
        }

        switch (subcommand) {
            case subcommand || subcommand !== null:
                const command = commands.find(cmd => cmd.data.name == subcommand);
                if (command) {
                    if (!command.data.options.empty) {
                        for (const option of command.data.options) {
                            embed.addFields({ 
                                name: option.name, 
                                value: option.description, 
                                inline: true 
                            });
                        }
                        embed.setDescription(`List of options for ${command.data.name}`);
                        await interaction.reply({
                            embeds: [embed]
                        });
                    } else {
                        await interaction.reply({
                            content: "This command has no options.",
                            ephemeral: true
                        });
                    }
                } else {
                    await interaction.reply({
                        content: "The `" + subcommand + "` command does not exist!",
                        ephemeral: true
                    });
                }
                
                break;
            default:
                for (const command of commands) {
                    embed.addFields({ 
                        name: `/${command.data.name}`, 
                        value: command.data.description, 
                        inline: true 
                    });
                }
                await interaction.reply({
                    embeds: [embed]
                });
                break;
        }
    }
};