import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import queue from "./queue";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays a song from a query")
  .addStringOption((option) => option
    .setName("query")
    .setDescription("Provide a name or url for the song")
    .setRequired(true)
  );
export async function execute(interaction, client) {
  const { options, member, channel } = interaction;
  const VoiceChannel = member.voice.channel;
  const vcId = member.voice.channelId;

  if (!VoiceChannel)
    return interaction.reply({
      content: "You must be in a voice channel to use the music commands.",
      ephemeral: true,
    });

  if (client.voice.channelId && vcId !== client.voice.channelId)
    return interaction.reply({
      content: `I am already playing music in <#${client.voice.channelId}>`,
      ephemeral: true,
    });

  client.distube.play(VoiceChannel, options.getString("query"), {
    textChannel: channel,
    member: member,
  });
  await interaction.reply({
    content: ":thumbsup::skin-tone-3:  Request recieved."
  });
}
