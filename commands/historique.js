const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {QuickDB} = require("quick.db");
const {clientId} = require("../config.json");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('historique')
        .setDescription(`Affiche la liste des warns d\'un utilisateur.`)
        .addUserOption(option =>
            option.setName('pseudo')
                .setDescription('Le pseudo de l\'utilisateur.')
                .setRequired(true)
        ),

    async execute(interaction) {

        function timestampToDate(timestamp) {
            const date = new Date(timestamp);
            const day = date.getDate();
            const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
            const mois = month[date.getMonth()];
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            if (minutes < 10) {
                return `${day} ${mois} ${year} à ${hours}:0${minutes}`;
            } else {
                return `${day} ${mois} ${year} à ${hours}:${minutes}`;
            }
        }

        const membre = interaction.guild.members.cache.get(interaction.options.getUser('pseudo').id);
        const sanctionEmbed = new EmbedBuilder();
        user_db.get(`${membre.id}.sanction`).then(async (list) => {
            if (list.length === 0) {
                sanctionEmbed
                    .setColor('#3dd583')
                    .setTitle(`Sanctions de ${membre.displayName}`)
                    .setThumbnail(membre.displayAvatarURL())
                    .addFields({
                        name: `**Sanction :**`,
                        value: `Aucune sanction n'a été ajoutée à ce membre. GG`
                    })
                    .setTimestamp()
                    .setFooter({text: 'Chanael', iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL()});
            } else {
                sanctionEmbed
                    .setColor('#3dd583')
                    .setTitle(`Sanctions de ${membre.displayName}`)
                    .setThumbnail(membre.user.displayAvatarURL())
                    .addFields(
                        list.map(s => {
                            return {
                                name: `**Sanction pour** : ${s.reason}`,
                                value: `${timestampToDate(s.timestamp)}\n**Par :** ${interaction.guild.members.cache.find(user => user.id === s.modo).displayName}`
                            }
                        })
                    )
                    .setTimestamp()
                    .setFooter({text: 'Chanael', iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL()});
            }
            interaction.reply({embeds: [sanctionEmbed]});
        });
    }
};
