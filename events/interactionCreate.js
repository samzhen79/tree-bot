const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        if (command.data.name == "clearhistory") {
            if (interaction.options.getString("category") == "bot") history_bot = [];
            if (interaction.options.getString("category") == "tree") history_tree = [];
            if (interaction.options.getString("category") == "kitten") history_kitten = [];
            if (interaction.options.getString("category") == "mean") history_mean = [];
        }
        try {
            if (command.data.name == "history") {
                if (interaction.options.getString("category") == "bot") await command.execute(interaction, history_bot);
                if (interaction.options.getString("category") == "tree") await command.execute(interaction, history_tree);
                if (interaction.options.getString("category") == "kitten") await command.execute(interaction, history_kitten);
                if (interaction.options.getString("category") == "mean") await command.execute(interaction, history_mean);
            }
            else await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
