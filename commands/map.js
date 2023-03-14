const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Minecraft map!'),
	async execute(interaction) {
		await interaction.reply('http://'+minecraftIP+':8123/');
	},
};