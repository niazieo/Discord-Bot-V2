const { createConnection, isIP } = require('node:net');
const { SlashCommandBuilder } = require('discord.js');

const CONNECTION_TIMEOUT_MS = 5000;

function checkServerPort(address, port) {
    return new Promise((resolve, reject) => {
        let socket;

        try {
            socket = createConnection({ host: address, port });
        } catch (error) {
            reject(error);
            return;
        }

        socket.setTimeout(CONNECTION_TIMEOUT_MS);
        socket.once('connect', () => {
            socket.destroy();
            resolve({ status: 'open' });
        });
        socket.once('timeout', () => {
            socket.destroy();
            resolve({ status: 'timeout' });
        });
        socket.once('error', (error) => {
            socket.destroy();

            if (error.code === 'ECONNREFUSED') {
                resolve({ status: 'closed' });
            } else if (error.code === 'ETIMEDOUT') {
                resolve({ status: 'timeout' });
            } else {
                resolve({ status: 'error', code: error.code });
            }
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-host')
        .setDescription('Check whether the configured server host accepts connections on the specified port'),

    async execute(interaction) {
        const address = process.env.SERVER_IP?.trim();
        const portValue = process.env.SERVER_PORT?.trim();
        const port = Number(portValue);

        if (!address || !isIP(address)) {
            await interaction.reply({
                content: '❌ Set `SERVER_IP` to a valid IPv4 or IPv6 address in the bot environment.',
                ephemeral: true,
            });
            return;
        }

        if (!portValue || !/^\d+$/.test(portValue) || !Number.isInteger(port) || port < 1 || port > 65535) {
            await interaction.reply({
                content: '❌ Set `SERVER_PORT` to a valid port number from 1 to 65535 in the bot environment.',
                ephemeral: true,
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const result = await checkServerPort(address, port);
            let response;

            switch (result.status) {
                case 'open':
                    response = `🟢 Server Host is online.`;
                    break;
                case 'closed':
                    response = `🟠 Server Host responded, but TCP port refused the connection.`;
                    break;
                case 'timeout':
                    response = `⚪ Connection to Server Host timed out. The host or network may be filtering traffic; this does not confirm that the host is offline.`;
                    break;
                default:
                    response = `❌ Could not reach Server Host${result.code ? ` (${result.code})` : ''}.`;
                    break;
            }

            await interaction.editReply(response);
        } catch (error) {
            console.error(`Failed to check ${address}:${port}:`, error);
            await interaction.editReply('❌ Could not run the server connection check.');
        }
    },
};
