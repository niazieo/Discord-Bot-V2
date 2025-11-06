export const name = "clientReady";
export const once = true;
export async function execute(client) {
  // Uncomment line below to randomize the presence of the bot
  // setInterval(client.pickPresence, 10 * 1000)
  client.pickPresence();
  console.log(`Ready! ${client.user.tag} is online.`);
}
  