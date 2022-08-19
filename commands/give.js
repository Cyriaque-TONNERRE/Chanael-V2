const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription(`Permet de transférer des Octets à un autre membre.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur qui va recevoir les Octets.')
                .setRequired(true),
        )
        .addIntegerOption(option =>
            option.setName('montant')
                .setDescription('Quantité d\'Octets à donner.')
                .setRequired(true),
        )
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison de la transaction.')
                .setRequired(false),
        ),

    async execute(interaction) {
        const money = await user_db.get(interaction.user.id + `.money`);
        const montant = interaction.options.getInteger('montant');
        if (montant > money) {
            interaction.reply({content: `Vous n'avez pas assez de <a:octet:1010177758250405888> !`, ephemeral: true});
        } else {
            const user = interaction.options.getUser('user');
            await user_db.add(user.id + `.money`, montant);
            await user_db.sub(interaction.user.id + `.money`, montant);
            interaction.reply({content: `Vous avez donné ${montant} <a:octet:1010177758250405888> à ${user.username} !`, ephemeral: true});
        }
    }
};
