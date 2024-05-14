const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play your favourite music!')
        .addStringOption(string => string
            .setName('song')
            .setDescription('Play the given song name/URL in your voice channel!')
            .setRequired(true)),

	async execute(interaction) {

        let guildQueue = interaction.client.player.hasQueue(interaction.guild.id);
        let queue;

        if (!guildQueue) {
            queue = interaction.client.player.createQueue(interaction.guild.id);
            queue.skipVotes = [];
        } else {
            queue = interaction.client.player.getQueue(interaction.guild.id);
        }

        let channel = interaction.member.voice.channel

        await queue.join(channel).catch((err) => {
            console.error(`Failed to join voice channel: ${err}`);
            });

        const songUrl = interaction.options.getString('song');
        console.log(`Attempting to play song: ${songUrl}`);

        let song = await queue.play(songUrl).catch(async err => {
            console.error(`Failed to play song: ${err}`);
            await interaction.reply(`Could not play the requested song! Error: ${err.message}`);
            queue.stop();
        });
        
        if (song) {
            await interaction.reply(`Now playing **${song.name}**`);
        }
}
};
