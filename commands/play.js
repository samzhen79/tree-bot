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
        let song = await queue.play(interaction.options.getString('song')).catch(async _ => {
            await interaction.reply('Could not play the requested song!');
            queue.stop();
        });
        
        if (song) {
            await interaction.reply(`Now playing **${song.name}**`);
        }
}
};
