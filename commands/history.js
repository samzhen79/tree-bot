const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.setDescription('Bots message history buffer'),
	async execute(interaction, history) {
		console.log(history)
		await interaction.reply(JSON.stringify(history));
	},
};