const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(`Permet de voir toutes les infos d'un utilisateur.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur concerné.')
                .setRequired(false)
        ),

    async execute(interaction) {
        let membre;
        if (interaction.options.getUser('user') === null) {
            membre = interaction.member;
        }
        else {
            membre = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        }
        user_db.get(membre.id).then((userData) => {
            const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
            const userEmbed = new EmbedBuilder()
            .setColor('#ffcb0f')
            .setTitle(`<:thinkies:928279092216860673>  Info sur ${membre.displayName}: <:thinkies:928279092216860673>`)
            .setThumbnail(membre.displayAvatarURL())
            .setTimestamp()
            .addFields(
                {
                    name: "Date d'anniversaire :",
                    value: `${userData ? (userData.dateAnniv.jour !== 0 ? `${userData.dateAnniv.jour} ${month[userData.dateAnniv.mois - 1]} :tada:` : "Cet utilisateur n'a pas publié son anniversaire !") :  "Cet utilisateur n'a pas publié son anniversaire !"}`
                },
            );
            interaction.reply({embeds: [userEmbed], ephemeral: true});
        })
    }
};

