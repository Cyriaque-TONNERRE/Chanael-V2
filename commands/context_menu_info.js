const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const {QuickDB} = require("quick.db");
const { round, pow } = require('mathjs');
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('info')
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const membre = interaction.targetMember;
        user_db.get(membre.id).then((userData) => {
            const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
            const userEmbed = new EmbedBuilder()
            .setColor('#ffcb0f')
            .setTitle(`<:thinkies:928279092216860673>  Info sur ${membre.displayName}: <:thinkies:928279092216860673>`)
            .setThumbnail(membre.displayAvatarURL())
            .setTimestamp()
            .addFields(
                {
                    name: "Money :",
                    value: `${userData ? userData.money :  0 } <a:octet:1010177758250405888>`,
                },
                {
                    name: "Niveau :",
                    value: `${userData ? userData.level :  0} <:finfrero:900010339540824104>`,
                },
                {
                    name: "Xp :",
                    value: `${userData ? userData.xp :  0} / ${userData ? round((3.5 * userData.level + 500) * (pow(1.02, userData.level))) :  500}`,
                },
                {
                    name: "Date d'anniversaire :",
                    value: `${userData ? (userData.dateAnniv.jour !== 0 ? `${userData.dateAnniv.jour} ${month[userData.dateAnniv.mois - 1]} :tada:` : "Cet utilisateur n'a pas publié son anniversaire !") :  "Cet utilisateur n'a pas publié son anniversaire !"}`
                },
            );
            interaction.reply({embeds: [userEmbed], ephemeral: true});
        })
    }
};

