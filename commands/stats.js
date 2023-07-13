const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const { forEach } = require('mathjs');
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription(`Permet de récuperer des stats autour de la momey genérer.`),

    async execute(interaction) {
        if (verificationpermission(interaction)){
            let totalMoney = 0;
            let MaxMoney = 0;
            let nbUserActif = 0;
            let actifMoney = 0;
            user_db.all().then(async (list) => {
                forEach(list, (user) => {
                    const money = user.value.money;
                    totalMoney += money;
                    if (money > MaxMoney) MaxMoney = money
                    if (money > 50) {
                        nbUserActif++;
                        actifMoney += money;
                    }
                });
                const statEmbed = new EmbedBuilder()
                    .setColor('#a21be3')
                    .setTitle(`<:hat:927602853319675975>  Stats : <:hat:927602853319675975> `)
                    .setTimestamp()
                    .addFields(
                        {
                            name: "Total de money sur le serveur :",
                            value: `${totalMoney}`,
                        },
                        {
                            name: "Max de money pour un user :",
                            value: `${MaxMoney}`,
                        },
                        {
                            name: "Moyenne de money des users actifs :",
                            value: `${parseInt(actifMoney/nbUserActif)}`,
                        },
                    );
                interaction.reply({embeds: [statEmbed]})
            });
        }
    }
};

