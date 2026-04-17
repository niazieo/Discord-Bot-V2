import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.'),
    async execute (interaction, client) {
        // tiny percentage chance for nuke
        const nukeChance = Math.random() < 0.05;
        if (nukeChance) {
            await interaction.reply({
                content: "YOU HIT A NUKE, YOU ACCIDENTALLY SMASHED TWO ATOMS IN A WAY THAT STARTED NUCLEAR FISSION"
            });
            return;
        }

        const coin = ['Heads', 'Tails'];
        const randomSide = coin[Math.floor(Math.random() * coin.length)];
        
        const imageName = randomSide === 'Heads' ? 'heads.png' : 'tails.png';
        const imagePath = path.join(__dirname, '../../assets', imageName);
        
        const attachment = new AttachmentBuilder(imagePath);
        
        await interaction.reply({
            content: randomSide,
            files: [attachment]
        });
    }
}