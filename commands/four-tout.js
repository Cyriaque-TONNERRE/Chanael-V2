const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('four-tout')
        .setDescription('Execute du code pour le fun.'),
    execute(interaction) {
        const result = interaction.guild.channels.cache.find(channel => channel.name === interaction.member.user.username.toLowerCase());
        console.log(result);
        interaction.reply({
            content: "ça fait tout crash, fait pas ça",
            ephemeral: true
        });
    },
};
