const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "people suffer",
        status: "online",
      },
      {
        type: ActivityType.Listening,
        text: "to the cries of sheep",
        status: "online",
      },
      {
        type: ActivityType.Playing,
        text: "/help for more commands!",
        status: "online",
      },
    ];
    const option = Math.floor(Math.random() * options.length);

    client.user.setPresence({
      activities: [
        {
          // Replace the number with 'option' for randomization
          name: options[2].text,
          type: options[2].type,
        },
      ],
    });
  };
};
