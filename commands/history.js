const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('history')
		.addStringOption(option => 
			option.setName('category')
					.setDescription('Chat Category')
					.setRequired(true)
					.addChoices(
						{name: "Tree", value: "tree"},
						{name: "Kitten", value: "kitten"}
					))
		.setDescription('Bots message history buffer'),
	async execute(interaction, history) {
		response = JSON.stringify(history)
		if (response.length > 3999) await interaction.reply("History exceeds character limit");
		else await interaction.reply();
		
	},
};