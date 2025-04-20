const { syllable } = require('syllable');
const { EmbedBuilder, italic } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.partial) return;
        if (message.author.bot) return;
        const syl = syllable(message.content)
        const words = message.content.split(' ')
        const lines = [[], [], []]
        const syllable_count = 0

        // console.log(syl)
        if (syl == 17) {
           for (const word in words) {
                if (syllable_count < 5) {
                    lines[0].push(words[word])
                } else if (syllable_count < 12) {
                    lines[1].push(words[word])
                } else {
                    lines[2].push(words[word])
                }
            }
            const haiku = lines[0].join(' ') + '\n' + lines[1].join(' ') + '\n' + lines[2].join(' ')
            const haikuEmbed = new EmbedBuilder()
            .setColor('#ffb7c5')
            .setDescription(italic(haiku))
            .setFooter({ text: message.author.displayName.toString(), iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            message.reply({
                embeds: [haikuEmbed],
                allowedMentions: {
                    repliedUser: false
                }
            })
        }
    }
};