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
        let song = await queue.play('https://www.youtube.com/watch?v=nRI9FMw0OB4').catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
        })
        await interaction.reply("Now Playing");
}
};