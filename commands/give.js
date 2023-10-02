const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {register_user} = require("../fonctions/register_user");
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
                .setMinValue(1)
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
            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            if (await user_db.has(member.id)) {
                await user_db.add(member.id + `.money`, montant);
                await user_db.sub(interaction.user.id + `.money`, montant);
                interaction.reply({content: `Vous avez donné ${montant} <a:octet:1010177758250405888> à ${member.displayName} !`/*, ephemeral: true*/});
            } else {
                register_user(member.id).then(async () => {
                    await user_db.add(member.id + `.money`, montant);
                    await user_db.sub(interaction.user.id + `.money`, montant);
                    interaction.reply({content: `Vous avez donné ${montant} <a:octet:1010177758250405888> à ${member.displayName} !`/*, ephemeral: true*/});
                })
            }


        }
    }
};
