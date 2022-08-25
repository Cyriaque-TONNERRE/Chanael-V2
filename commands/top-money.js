const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {forEach} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top-money')
        .setDescription(`Liste des personnes les plus riche du serveur.`),

    async execute(interaction) {
        let orderTab = [];
        user_db.all().then(async (list) => {
            forEach(list, (user) => {
                if (user.value.money !== 0) {
                    const listmember = {
                        id: user.id,
                        money: user.value.money,
                    }
                    orderTab.push(listmember);

                }
            });
            const topMoneyEmbed = new EmbedBuilder()
                .setColor('#a21be3')
                .setTitle(`<a:octet:1010177758250405888> Les 10 personnes les plus riches sont : <a:octet:1010177758250405888>`)
                .setTimestamp()
            orderTab.sort((a, b) => b.money - a.money);
            if (orderTab.length === 0) {
                topMoneyEmbed.setDescription(`Personne n'a d'argent sur le serveur.`);
            } else {
                if (orderTab.length > 10) {
                    orderTab = orderTab.splice(0, 10);
                }
                let description = `**Les ${orderTab.length} premiers sont :** \n\n`;
                let i = 1;
                orderTab.forEach((user) => {
                    if (i === 1) {
                        description = description.concat(`> 🥇 **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 2) {
                        description = description.concat(`> 🥈 **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 3) {
                        description = description.concat(`> 🥉 **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 4) {
                        description = description.concat(`> :four: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 5) {
                        description = description.concat(`> :five: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 6) {
                        description = description.concat(`> :six: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 7) {
                        description = description.concat(`> :seven: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 8) {
                        description = description.concat(`> :eight: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 9) {
                        description = description.concat(`> :nine: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    } else if (i === 10) {
                        description = description.concat(`> :keycap_ten: **${interaction.guild.members.cache.get(user.id).displayName}**: ${list.find(u => u.id === user.id).value.money} <a:octet:1010177758250405888>\n`);
                        i++;
                    }
                })
                topMoneyEmbed.setDescription(description);
                interaction.reply({embeds: [topMoneyEmbed]});
            }
        })
    }
};
