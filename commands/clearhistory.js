const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearhistory')
		.setDescription('Clears the bots message history'),
	async execute(interaction) {
		await interaction.reply('History has been cleared');
	},
};