import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Flips a coin.'),
    async execute (interaction, client) {
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