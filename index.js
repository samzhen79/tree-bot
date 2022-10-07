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
    let targetGuild = client.guilds.cache.get('795738159265611817')
    let sounds = ['https://www.youtube.com/watch?v=XpJEg6MTPzc&ab_channel=DucklasMacDuck',
                'https://www.youtube.com/watch?v=YVTR8lTnnx8&list=PL6F112y8X_M5F7_DFgeIbSI5Tb9Cx7CA4&index=3&ab_channel=Dagre',
                'https://www.youtube.com/watch?v=iqkQRgGdAPo&ab_channel=JeremySoule-Topic',
                'https://www.youtube.com/watch?v=idu7_wLb69E&ab_channel=Poet']
    let guildQueue = client.player.getQueue(targetGuild);
    let timer = getRandomInt(1000000,100000000)
    let counter = 0
    setTimeout(async () => {
        counter += 1
        console.log("Attempted Invasions: " + counter)
        let channel = targetGuild.channels.cache.filter(ch => ch.type === 2).random().id
        let queue = client.player.createQueue(targetGuild);
        await queue.join(channel).catch(err => {console.log(err);});
        let song = await queue.play(sounds[Math.floor(Math.random() * sounds.length)]).catch(err => {
            console.log(err);
        })
        timer = getRandomInt(1000000,100000000)
    }, timer)

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
      }
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