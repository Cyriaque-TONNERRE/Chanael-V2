const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {forEach} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top-level')
        .setDescription(`Liste des personnes au plus haut niveau du serveur.`),

    async execute(interaction) {
        let orderTab = [];
        user_db.all().then(async (list) => {
            forEach(list, (user) => {
                if (interaction.guild.members.cache.get(user.id) !== undefined) {
                    if (user.value.level !== 0 && user.value.xp !== 0) {
                        const listmember = {
                            id: user.id,
                            level: user.value.level,
                            xp: user.value.xp
                        }
                        orderTab.push(listmember);
                    }
                }
            })
            const topLevelEmbed = new EmbedBuilder()
                .setColor('#a21be3')
                .setTitle(`<:hat:927602853319675975>  Les 10 personnes au plus haut niveau sont : <:hat:927602853319675975> `)
                .setTimestamp()
            //trie orderTab selon le level puis le xp
            orderTab.sort((a, b) => {
                if (a.level < b.level) {
                    return 1;
                }
                if (a.level > b.level) {
                    return -1;
                }
                if (a.xp < b.xp) {
                    return 1;
                }
                if (a.xp > b.xp) {
                    return -1;
                }
                return 0;
            });
            if (orderTab.length === 0) {
                topLevelEmbed.setDescription(`Personne n'a d'xp sur le serveur.`);
            } else {
                if (orderTab.length > 10) {
                    orderTab = orderTab.splice(0, 10);
                }
                let description = `**Les ${orderTab.length} premiers sont :** \n\n`;
                let i = 1;
                orderTab.forEach((user) => {
                    if (i === 1) {
                        description = description.concat(`> 🥇 **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 2) {
                        description = description.concat(`> 🥈 **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 3) {
                        description = description.concat(`> 🥉 **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 4) {
                        description = description.concat(`> :four: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 5) {
                        description = description.concat(`> :five: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 6) {
                        description = description.concat(`> :six: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 7) {
                        description = description.concat(`> :seven: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 8) {
                        description = description.concat(`> :eight: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 9) {
                        description = description.concat(`> :nine: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    } else if (i === 10) {
                        description = description.concat(`> :keycap_ten: **${interaction.guild.members.cache.get(user.id).displayName}**: Niveau: ${list.find(u => u.id === user.id).value.level}\n`);
                        i++;
                    }
                })
                topLevelEmbed.setDescription(description);
                interaction.reply({embeds: [topLevelEmbed]});
            }
        })
    }
};
