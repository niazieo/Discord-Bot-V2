export default {
    name: "clientReady",
    once: true,
    async execute(client) {
        // Uncomment line below to randomize the presence of the bot
        // setInterval(client.pickPresence, 10 * 1000)
        client.pickPresence();
        console.log(`Ready! ${client.user.tag} is online.`);
    },
};