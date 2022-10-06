const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('You dont want to know'),

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