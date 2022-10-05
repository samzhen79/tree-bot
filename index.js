const dotenv = require('dotenv');
dotenv.config()

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log('Ready!')
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'minecraft') {
		await interaction.reply('129.151.81.83');
	} else if (commandName === 'map') {
		await interaction.reply('http://129.151.81.83:8123/');
	}
});

client.on("messageCreate", async (message) => {
    // console.log(message)

    if (!message?.author.bot) {
        console.log(message.content)
        if (message.content.toLowerCase().includes('tree')) {
            message.channel.send({ files: [{ attachment: 'tree.png' }] })
        }
    }
})

client.login(process.env.DISCORD_TOKEN)