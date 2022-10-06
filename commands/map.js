const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Minecraft map!'),
	async execute(interaction) {
		await interaction.reply('http://129.151.81.83:8123/');
	},
};