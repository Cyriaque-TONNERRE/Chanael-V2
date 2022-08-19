const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription(`Permet de récupérer des octets chaque jours.`),

    async execute(interaction) {
        if (await user_db.get(interaction.user.id + `.lastDaily`) === null) {
            await user_db.set(interaction.user.id + `.lastDaily`, new Date().getTime());
            await user_db.add(interaction.user.id + `.money`, 125);
            interaction.reply({content:`Vous avez reçu 125 <a:octet:1010177758250405888> !`, ephemeral: true});
        } else {
            const lastDaily = await user_db.get(interaction.user.id + `.lastDaily`);
            const diff = new Date().getTime() - lastDaily;
            if (diff >= 86400000) {
                await user_db.set(interaction.user.id + `.lastDaily`, new Date().getTime());
                await user_db.add(interaction.user.id + `.money`, 125);
                interaction.reply({content:`Vous avez reçu 125 <a:octet:1010177758250405888> !`, ephemeral: true});
            } else {
                interaction.reply({content: `Vous avez déjà reçu votre récompense aujourd'hui !`, ephemeral: true});
            }
        }
    }
};
