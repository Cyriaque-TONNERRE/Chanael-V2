const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription(`Affiche la money de l'utilisateur.`),

    async execute(interaction) {
        const money = await user_db.get(interaction.user.id + `.money`);
        interaction.reply({content: `Vous avez ${money} <a:octet:1010177758250405888> !`, ephemeral: true});
    }
};