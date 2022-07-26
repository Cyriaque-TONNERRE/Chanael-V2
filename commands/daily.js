const { SlashCommandBuilder} = require('discord.js');
const {roleNoXpNoMoney} = require("../config.json");
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription(`Permet de récupérer des Octets chaque jours.`),

    async execute(interaction) {
        if (interaction.member.roles.cache.hasAny(...roleNoXpNoMoney)) {
            interaction.reply({content: `Vous ne pouvez pas utiliser cette commande !`, ephemeral: true});
        } else {
            if (await user_db.get(interaction.user.id + `.lastDaily`) === null) {
                await user_db.set(interaction.user.id + `.lastDaily`, new Date().getDate());
                await user_db.add(interaction.user.id + `.money`, 125);
                interaction.reply({content: `Vous avez reçu 125 <a:octet:1010177758250405888> !`, ephemeral: true});
            } else {
                const lastDaily = await user_db.get(interaction.user.id + `.lastDaily`);
                if (new Date().getDate() !== lastDaily) {
                    await user_db.set(interaction.user.id + `.lastDaily`, new Date().getDate());
                    await user_db.add(interaction.user.id + `.money`, 125);
                    interaction.reply({content: `Vous avez reçu 125 <a:octet:1010177758250405888> !`, ephemeral: true});
                } else {
                    interaction.reply({content: `Vous avez déjà reçu votre récompense aujourd'hui !`, ephemeral: true});
                }
            }
        }
    }
};
