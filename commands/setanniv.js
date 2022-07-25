const { SlashCommandBuilder } = require('discord.js');

const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setanniv')
        .setDescription(`Permet de régler la date de votre anniversaire. (/!\\ faisable qu'une fois)`)
        .addIntegerOption(option =>
            option.setName('jour')
                .setDescription('Le jour de votre anniversaire.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(31)
        )
        .addIntegerOption(option =>
            option.setName('mois')
                .setDescription('Le mois de votre anniversaire.')
                .setRequired(true)
                .addChoices(
                    { name: 'Janvier', value: 1 },
                    { name: 'Février', value: 2 },
                    { name: 'Mars', value: 3 },
                    { name: 'Avril', value: 4 },
                    { name: 'Mai', value: 5 },
                    { name: 'Juin', value: 6 },
                    { name: 'Juillet', value: 7 },
                    { name: 'Août', value: 8 },
                    { name: 'Septembre', value: 9 },
                    { name: 'Octobre', value: 10 },
                    { name: 'Novembre', value: 11 },
                    { name: 'Décembre', value: 12 }
                )
        )
        .addIntegerOption(option =>
            option.setName('année')
                .setDescription('L\'année de votre anniversaire.')
                .setRequired(true)
                .setMinValue(1950)
                .setMaxValue(new Date().getFullYear())
        ),

    async execute(interaction) {
        if (await user_db.get(interaction.member.id + ".dateAnniv.jour") !== 0) {
            await interaction.reply({ content: 'Vous avez déjà réglé votre anniversaire!', ephemeral: true });
        } else {
            user_db.add(interaction.member.id + ".dateAnniv.jour", interaction.options.getInteger("jour")).then(() => {
                user_db.add(interaction.member.id + ".dateAnniv.mois", interaction.options.getInteger("mois")).then(() => {
                    user_db.add(interaction.member.id + ".dateAnniv.annee", interaction.options.getInteger("année")).then(() => {
                        interaction.reply({ content: 'Votre anniversaire a bien été réglé!', ephemeral: true });
                    });
                });
            });
        }
    },
};
