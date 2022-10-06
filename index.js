const dotenv = require('dotenv');
dotenv.config()

const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-music-player");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = new Player(client, {
    leaveOnEmpty: false, // This options are optional.
});

client.player = player;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

client.once('ready', () => {
    console.log('Ready!')
})

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

    let guildQueue = client.player.getQueue(interaction.guild.id);

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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