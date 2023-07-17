const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes.'),
    async execute(interaction) {
        const commands = interaction.client.commands.filter(command => command.data.description !== undefined).filter(command => command.data.description !== "undefined");
        await interaction.reply({
            content: `📚 Liste des commandes :\n\n${commands.map(command => `**${command.data.name}** : ${command.data.description}`).join('\n')}`,
            ephemeral: true
        });
    },
};
