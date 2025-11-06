import { syllable } from 'syllable';
import { EmbedBuilder, italic } from 'discord.js';

export const name = 'messageCreate';
export async function execute(message) {
    if (message.partial) return;
    if (message.author.bot) return;
    if (syllable(message.content) !== 17) return;
    // console.log(syllable(message.content))
    const words = message.content.split('\n').join(' ').split(' ');
    const lines = [[], [], []];
    const syllable_limts = [5, 7, 5];
    let syllable_count = 0;
    let current_line = 0;

    for (const word of words) {
        if (syllable_count + syllable(word) > syllable_limts[current_line]) {
            current_line++;
            syllable_count = 0;
            if (current_line >= lines.length) return;
        }
        lines[current_line].push(word);
        syllable_count += syllable(word);
    }
    // console.log(syllable(lines[0].join(' ')), syllable(lines[1].join(' ')), syllable(lines[2].join(' ')));
    if (syllable(lines[0].join(' ')) === 5 && syllable(lines[1].join(' ')) === 7 && syllable(lines[2].join(' ')) === 5) {
        const haiku = `${lines[0].join(' ')}\n${lines[1].join(' ')}\n${lines[2].join(' ')}`;
        // console.log(lines[1])
        const haikuEmbed = new EmbedBuilder()
            .setColor('#ffb7c5')
            .setDescription(italic(haiku))
            .setFooter({ text: message.author.displayName.toString(), iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();
        message.reply({
            embeds: [haikuEmbed],
            allowedMentions: {
                repliedUser: false
            }
        });
    } else {
        return;
    }
}