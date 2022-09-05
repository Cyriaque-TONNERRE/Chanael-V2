const {SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Permet de renomer son salon temporaire.')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom du salon.')
                .setRequired(true)),

    async execute(interaction) {
        user_db.get(interaction.user.id + ".channelPerso").then(async (channel) => {
            if (channel === undefined) {
                interaction.reply({ content: `Vous n'avez pas de salon personnel !`, ephemeral: true});
            } else {
                await interaction.guild.channels.cache.get(channel).setName(interaction.options.getString('nom'));
                interaction.reply({content: `Le salon a bien été renommé.`, ephemeral: true});
            }
        });
    },
};
