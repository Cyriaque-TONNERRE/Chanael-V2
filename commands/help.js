const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes.'),
    async execute(interaction) {
        await interaction.reply({
            content: `📚 Liste des commandes :\n\n${interaction.client.commands.map(command => `**${command.data.name}** : ${command.data.description}`).join('\n')}`,
            ephemeral: true
        });
    },
};
