const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Ouvre le GitHub du bot.'),
    async execute(interaction) {
        const GithubLink = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Github')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/Cyriaque-TONNERRE/Chanael-V2')
        );
        interaction.reply({
            content: `Ci-dessous le github du bot, n'hésitez pas si vous trouvez des erreurs et/ou si vous voulez proposer des fonctionnalités **utiles**.`,
            components: [GithubLink],
            ephemeral: true
        });
    },
};
