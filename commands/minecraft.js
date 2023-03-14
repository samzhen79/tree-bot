const { SlashCommandBuilder } = require('discord.js');
const { minecraftIP } = require('./config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('minecraft')
		.setDescription('Minecraft server ip!'),
	async execute(interaction) {
		await interaction.reply(minecraftIP);
	},
};