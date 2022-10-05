import dotenv from 'dotenv'
dotenv.config()

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
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