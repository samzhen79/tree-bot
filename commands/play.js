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

        let queue = interaction.client.player.createQueue(interaction.guild.id);
        await queue.join(interaction.member.voice.channel);
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
