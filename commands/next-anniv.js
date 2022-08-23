const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {forEach} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('next-anniv')
        .setDescription(`Affiche la liste des 10 prochains anniversaires.`),

    async execute(interaction) {
        const month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
        let todayMillis = new Date().getTime();
        let orderTab = [];
        user_db.all().then(async (list) => {
            forEach(list, (user) => {
                if (user.value.dateAnniv.jour !== 0) {
                    if (new Date(`${new Date().getFullYear()}-${user.value.dateAnniv.mois}-${user.value.dateAnniv.jour}`).getTime() > todayMillis) {
                        const listmember = {
                            id: user.id,
                            date: new Date(`${new Date().getFullYear()}-${user.value.dateAnniv.mois}-${user.value.dateAnniv.jour}`).getTime() - todayMillis,
                        }
                        orderTab.push(listmember);
                    } else {
                        const listmember = {
                            id: user.id,
                            date: new Date(`${new Date().getFullYear() + 1}-${user.value.dateAnniv.mois}-${user.value.dateAnniv.jour}`).getTime() - todayMillis + 31556926000,
                        }
                        orderTab.push(listmember);
                    }
                }
            });
            const nextAnnivEmbed = new EmbedBuilder()
                .setColor('#a21be3')
                .setTitle(`Anniversaires à venir sur le serveur ! :beers:`)
                .setFooter({text: `N'hésitez pas à ajouter votre anniversaire avec /setanniv`});
            orderTab.sort((a, b) => a.date - b.date);
            if (orderTab.length === 0) {
                nextAnnivEmbed.setDescription('Aucun anniversaire à venir.');
            } else {
                if (orderTab.length > 10) {
                    orderTab = orderTab.splice(0, 10);
                }
                let description = `Voici la liste des ${orderTab.length} prochains membres fêtant leur anniversaire :\n\n`;
                orderTab.forEach((user) => {
                    const date = list.find(u => u.id === user.id).value.dateAnniv;
                    let annee;
                    if (user.date >= new Date(`${new Date().getFullYear()}-12-31`).getTime()/100) {
                        annee = new Date().getFullYear() - date.annee + 1;
                    } else {
                        annee = new Date().getFullYear() - date.annee;
                    }
                    description = description.concat(`> **${interaction.guild.members.cache.get(user.id).displayName}**: ${date.jour} ${month[date.mois - 1]} (${annee} ans)\n`);
                })
                nextAnnivEmbed.setDescription(description);
                interaction.reply({embeds: [nextAnnivEmbed]});
            }
        })
    }
};
