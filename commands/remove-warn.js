const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-warn')
        .setDescription(`Permet de retirer un warn.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur qui va recevoir les Octets.')
                .setRequired(true),
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

        if (verificationpermission(interaction)){
            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            if (await user_db.has(member.id)) {
                let liste_warn = await user_db.get(member.id + `.sanction`);
                if (liste_warn.length > 0){
                    let liste_warn_affichage = [];
                    for (let i = 0; i < liste_warn.length; i++) {
                        liste_warn_affichage.push({label: liste_warn[i].reason, value: i.toString() + " " + member.id.toString(), description: "Le " + timestampToDate(liste_warn[i].timestamp) + " par " + interaction.guild.members.cache.get(liste_warn[i].modo).displayName});
                    }
                    // Afficher la liste des warns dans un select menu
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('remove-warn')
                                .setPlaceholder('Choisissez un warn à retirer')
                                .addOptions(liste_warn_affichage)
                        );
                    interaction.reply({content: `Choisissez un warn à retirer :`, components: [row]}).then( () => {
                        setTimeout(() => interaction.deleteReply(), 60000);
                    }).catch();
                } else {
                    interaction.reply({content: `L'utilisateur n'a aucun warn.`, ephemeral: true});
                }
            } else {
                interaction.reply({content: `L'utilisateur n'a aucun warn.`, ephemeral: true});
            }
        }
    }
}