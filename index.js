const dotenv = require('dotenv');
dotenv.config()
const { minDelay, maxDelay, specialMessage } = require('./config.json');

const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { Player } = require("discord-music-player");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);
const system_message = {"role": "system", "content": "Answer as if you are playing the role of an e-girl"}
let history = []

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

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
    let timer = getRandomInt(minDelay,maxDelay)
    // let timer = getRandomInt(1000,10000)
    let counter = 0
    setInterval(async () => {
        counter += 1
        console.log("Attempted Invasions: " + counter + " at time: " + Date.now());
        const channels = []
        targetGuild.channels.cache.filter(ch => ch.type === 2).forEach(channel => {
            if (channel.members.size == 0) {
                return;
            }
            else {
                channels.push(channel);
            }
        });
        if (!channels.length) {
            console.log("No active voice channels");
            return;
        }
        let targetChannel = channels[Math.floor(Math.random() * channels.length)].id;
        console.log(targetChannel);

        let queue = client.player.createQueue(targetGuild);
        await queue.join(targetChannel).catch(err => {console.log(err);});
        let song = await queue.play(sounds[Math.floor(Math.random() * sounds.length)]).catch(err => {
            console.log(err);
        })
        let timer = getRandomInt(minDelay,maxDelay);
    }, timer)
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
    if (command.data.name == "clearhistory") history = [];
	try {
        if (command.data.name == "history") await command.execute(interaction, history);
        else await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("messageCreate", async (message) => {
    // console.log(message)

    if (!message?.author.bot) {
        console.log(message.content);
        if (message.content.toLowerCase().startsWith('hey bot')) {
            message_response = await message.channel.send("Thinking...");
            if (history.length > 3) history.shift();
            history.push({"role": "user", "content": message.content.slice(7)});
            gpt_messages = history.concat(system_message);
            gpt_response = await openai.createChatCompletion({model: "gpt-3.5-turbo", messages: gpt_messages, temperature: 0.2}).catch((err) => {
                message_response.edit("oops " + err);
                return;
            });
            try { 
            // console.log(gpt_response) 
            } 
            catch(err) {
                console.log("oh no" + err);
                return;
            }
            console.log(gpt_response.data.choices[0])
            if (gpt_response.data.choices[0].finish_reason != "stop" && gpt_response.data.choices[0].finish_reason != null) {
                message_response.edit(gpt_response.data.choices[0].message.content + "error: " + gpt_response.data.choices[0].finish_reason);
                history.pop();
            }
            else {
                message_response.edit(gpt_response.data.choices[0].message.content);
                if (history.length > 3) history.shift();
                history.push(gpt_response.data.choices[0].message);
            }
        }
        if (message.content.toLowerCase().includes('tree')) {
            message.channel.send({ files: [{ attachment: 'tree.png' }] })
            if (message.content.toLowerCase() == 'tree') {
                if (getRandomInt(0,50) == 25) {
                    message.channel.send(specialMessage);
                }  
            }
 
        }
    }
})

client.login(process.env.DISCORD_TOKEN)