import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

function getPterodactylConfig() {
    const panelUrl = process.env.PTERO_URL?.trim();
    const apiKey = process.env.PTERO_API_KEY?.trim();

    if (!panelUrl || !apiKey) {
        throw new Error('PTERO_URL and PTERO_API_KEY must be configured.');
    }

    const parsedUrl = new URL(panelUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('PTERO_URL must use HTTP or HTTPS.');
    }

    return {
        panelUrl: panelUrl.replace(/\/+$/, ''),
        apiKey,
    };
}

async function pteroFetch(endpoint, config) {
    const url = `${config.panelUrl}/api/client${endpoint}`;

    const response = await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + config.apiKey,
            Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
    });

    // console.log(`[Pterodactyl] ${response.status} ${url}`);

    if (!response.ok) {
        const body = await response.text();
        console.error('API error response:', body.slice(0, 500));
        throw new Error(`Pterodactyl API returned ${response.status} for ${url}`);
    }

    return response.json();
}

async function getServerStatuses(servers, config) {
    const concurrency = Math.min(4, Math.max(1, servers.length));
    let nextIndex = 0;

    const workers = Array.from({ length: concurrency }, async () => {
        const results = [];

        while (nextIndex < servers.length) {
            const server = servers[nextIndex++];
            const attrs = server.attributes ?? {};

            if (attrs.is_suspended || attrs.suspended) {
                results.push({
                    name: attrs.name,
                    identifier: attrs.identifier,
                    suspended: true,
                    stats: null,
                });
                continue;
            }

            try {
                const data = await pteroFetch(`/servers/${attrs.identifier}/resources`, config);

                results.push({
                    name: attrs.name,
                    identifier: attrs.identifier,
                    suspended: Boolean(data?.attributes?.is_suspended),
                    stats: data?.attributes ?? null,
                });
            } catch (error) {
                console.error(`Failed to check ${attrs.name}:`, error.message);

                results.push({
                    name: attrs.name,
                    identifier: attrs.identifier,
                    suspended: false,
                    error: true,
                });
            }
        }

        return results;
    });

    const batches = await Promise.all(workers);
    return batches.flat();
}

function formatBytes(bytes) {
    if (bytes == null) return 'N/A';

    const gb = bytes / (1024 ** 3);
    if (gb >= 1) return `${gb.toFixed(2)} GiB`;

    return `${(bytes / (1024 ** 2)).toFixed(0)} MiB`;
}

function formatUptime(ms) {
    if (ms == null) return 'N/A';

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
}

function statusInfo(state, suspended) {
    if (suspended) {
        return { label: 'Suspended', emoji: '⛔' };
    }

    switch (state) {
        case 'running':
            return { label: 'Online', emoji: '🟢' };
        case 'starting':
            return { label: 'Starting', emoji: '🟡' };
        case 'stopping':
            return { label: 'Stopping', emoji: '🟠' };
        case 'offline':
            return { label: 'Offline', emoji: '🔴' };
        default:
            return { label: state || 'Unknown', emoji: '⚪' };
    }
}

export default {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Check the status of your game servers'),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const config = getPterodactylConfig();
            const result = await pteroFetch('', config);
            const servers = Array.isArray(result.data)
                ? result.data
                : Array.isArray(result.data?.data)
                    ? result.data.data
                    : [];

            if (servers.length === 0) {
                // console.log('API response:', JSON.stringify(result).slice(0, 2000));
                return interaction.editReply('No game servers were found on your account.');
            }

            const results = await getServerStatuses(servers, config);
            const embed = new EmbedBuilder()
                .setTitle('🖥️ Game Server Status')
                .setColor(0x5865F2)
                .setTimestamp()
                .setFooter({
                    text: `Checked ${results.length} server(s)`,
                });

            let online = 0;
            let offline = 0;
            let unknown = 0;

            for (const server of results) {
                if (server.suspended) {
                    embed.addFields({
                        name: `⛔ ${server.name}`,
                        value: '**Status:** Suspended\nResource statistics unavailable.',
                        inline: true,
                    });

                    unknown++;
                    continue;
                }

                if (server.error) {
                    unknown++;
                    embed.addFields({
                        name: `⚪ ${server.name}`,
                        value: 'Status: Unknown (API request failed)',
                        inline: false,
                    });
                    continue;
                }

                const { current_state, resources } = server.stats ?? {};
                const status = statusInfo(current_state, server.suspended);

                if (current_state === 'running' && !server.suspended) {
                    online++;
                } else if (current_state === 'offline') {
                    offline++;
                } else {
                    unknown++;
                }

                const memory = formatBytes(resources?.memory_bytes);
                const disk = formatBytes(resources?.disk_bytes);
                const cpu = resources?.cpu_absolute;

                const details = [
                    `**Status:** ${status.emoji} ${status.label}`,
                    `**CPU:** ${cpu == null ? 'N/A' : `${cpu.toFixed(1)}%`}`,
                    `**RAM:** ${memory}`,
                    `**Disk:** ${disk}`,
                    `**Uptime:** ${formatUptime(resources?.uptime)}`,
                ].join('\n');

                embed.addFields({
                    name: server.name,
                    value: details,
                    inline: true,
                });
            }

            embed.setDescription(
                `🟢 Online: **${online}** | ` +
                `🔴 Offline: **${offline}** | ` +
                `⚪ Other/Unknown: **${unknown}**`
            );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Game server status check failed:', error);
            await interaction.editReply(
                '❌ Could not retrieve your game servers. ' +
                'Check your panel URL, API key, and API permissions.'
            );
        }
    },
};
