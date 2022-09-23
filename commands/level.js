const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {round, pow} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription(`Affiche le niveau de l'utilisateur.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur concerné.')
                .setRequired(false),
        ),

    async execute(interaction) {
        if (interaction.options.getUser('user') === null) {
            const lvl = await user_db.get(interaction.user.id + `.level`);
            const xp = await user_db.get(interaction.user.id + `.xp`);
            interaction.reply({content: `Vous êtes ${lvl} ! (${xp}/${round((3.5 * lvl + 500) * (pow(1.02, lvl)))})`, ephemeral: true});
        } else {
            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            const lvl = await user_db.get(member.id + `.level`);
            const xp = await user_db.get(member.id + `.xp`);
            interaction.reply({content: `${member.displayName} est ${lvl} ! (${xp}/${round((3.5 * lvl + 500) * (pow(1.02, lvl)))})`, ephemeral: true});
        }
    }
};
