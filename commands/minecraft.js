const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Minecraft server ip!'),
	async execute(interaction) {
		await interaction.reply('129.151.81.83');
	},
};