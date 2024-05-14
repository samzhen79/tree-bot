const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearhistory')
		.addStringOption(option => 
			option.setName('category')
				.setDescription('Chat Category')
				.setRequired(true)
				.addChoices(
					{name: "Tree", value: "tree"},
					{name: "Kitten", value: "kitten"}
				))
		.setDescription('Clears the bots message history'),
	async execute(interaction) {
		await interaction.reply('History has been cleared');
	},
};