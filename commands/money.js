const { SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription(`Affiche le nombre d\'Octets de l'utilisateur.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur concerné.')
                .setRequired(false),
        ),

    async execute(interaction) {
        if (interaction.options.getUser('user') === null) {
            let money = await user_db.get(interaction.user.id + `.money`);
            if(isNaN(money)) {
                money = 0;
            }
            interaction.reply({content: `Vous avez ${money} <a:octet:1010177758250405888> !`, ephemeral: true});
        } else {
            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            let money = await user_db.get(member.id + `.money`);
            if(isNaN(money)) {
                money = 0;
            }
            interaction.reply({content: `${member.displayName} a ${money} <a:octet:1010177758250405888> !`, ephemeral: true});
        }
    }
};
