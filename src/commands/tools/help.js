import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

async function getCommands() {
    const commandFolders = readdirSync('./src/commands');
    const commands = [];

    for (const folder of commandFolders) {
        if (folder === 'music') continue;

        const commandFiles = readdirSync(`./src/commands/${folder}`)
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const fullPath = path.resolve(`./src/commands/${folder}/${file}`);
            const imported = await import(pathToFileURL(fullPath).href);
            const command = imported.default ?? imported;

            if (command?.data?.name) {
                commands.push(command);
            }
        }
    }

    return commands;
}

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Return an embed with all the available commands')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('Specify which command to get help for')
                .setRequired(false)
        ),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setDescription('List of available commands')
            .setColor(0x00ffff)

        const subcommand = interaction.options.getString('command');
        const commands = await getCommands();

        if (subcommand) {
            const command = commands.find((cmd) => cmd.data.name === subcommand);

            if (!command) {
                return interaction.reply({
                    content: `The \`${subcommand}\` command does not exist!`,
                    ephemeral: true,
                });
            }

            const options = command.data.options ?? [];

            if (options.length === 0) {
                return interaction.reply({
                    content: 'This command has no options.',
                    ephemeral: true,
                });
            }

            for (const option of options) {
                embed.addFields({
                    name: option.name,
                    value: option.description,
                    inline: true,
                });
            }

            embed.setDescription(`List of options for /${command.data.name}`);
            return interaction.reply({ embeds: [embed] });
        }

        for (const command of commands) {
            embed.addFields({
                name: `/${command.data.name}`,
                value: command.data.description,
                inline: true,
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};

