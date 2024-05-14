const { Events } = require('discord.js');

const { minDelay, maxDelay, guildId } = require('../config.json');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) { 
        let targetGuild = client.guilds.cache.get(guildId)
        let sounds = ['https://www.youtube.com/watch?v=XpJEg6MTPzc&ab_channel=DucklasMacDuck',
                    'https://www.youtube.com/watch?v=YVTR8lTnnx8&list=PL6F112y8X_M5F7_DFgeIbSI5Tb9Cx7CA4&index=3&ab_channel=Dagre',
                    'https://www.youtube.com/watch?v=iqkQRgGdAPo&ab_channel=JeremySoule-Topic',
                    'https://www.youtube.com/watch?v=idu7_wLb69E&ab_channel=Poet']
        let guildQueue = client.player.hasQueue(targetGuild);
        let queue;

        if (!guildQueue) {
            queue = client.player.createQueue(targetGuild);
            queue.skipVotes = [];
        } else {
            queue = client.player.getQueue(targetGuild);
        }

        let timer = getRandomInt(minDelay,maxDelay)
        // let timer = getRandomInt(1000,10000)
        let counter = 0
        console.log('Ready!')
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

            await queue.join(targetChannel).catch(err => {console.log(err);});
            let song = await queue.play(sounds[Math.floor(Math.random() * sounds.length)]).catch(err => {
                console.log(err);
            })
            let timer = getRandomInt(minDelay,maxDelay);
        }, timer)
        },
    };