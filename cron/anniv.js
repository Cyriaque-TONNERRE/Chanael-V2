const cron = require('node-cron');
const { EmbedBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const {forEach, randomInt} = require("mathjs");
const { guildId, channelBDayId } = require('../config.json');
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'anniv',
    execute(client) {
        cron.schedule('0 8 * * *', async () => {
            await user_db.all().then(list => {
                forEach(list, (elem) => {
                    if (elem.value.dateAnniv !== undefined) {
                        if (elem.value.dateAnniv.jour === new Date().getDate() && elem.value.dateAnniv.mois === new Date().getMonth() + 1) {
                            const bdaygif = ["https://media3.giphy.com/media/SwIMZUJE3ZPpHAfTC4/giphy.gif", "https://c.tenor.com/TrWnbBpJfeIAAAAC/leonardo-di-caprio-dancing.gif", "https://c.tenor.com/WWKu06Gnp4wAAAAC/happy-birthday-to-you-minions.gif", "https://c.tenor.com/M2oEjniH2mUAAAAC/birthday-wishes.gif", "https://c.tenor.com/jZBtwg1PCMUAAAAd/keanu-reeves-birthday-cake.gif", "https://c.tenor.com/kjSdnyBOo3YAAAAi/verjaardag.gif", "https://i.pinimg.com/originals/11/68/82/116882088dc7f44d5cc3d3377f963c70.gif", "https://thumbs.gfycat.com/RepentantUnpleasantFantail-size_restricted.gif", "https://i.imgur.com/34YQYmg.gif", "https://media.giphy.com/media/oXpZ1sLkbCZ9jFhBMx/giphy.gif", "https://hurfat.com/wp-content/uploads/2021/07/Happy-Birthday...-22.gif", "https://i.pinimg.com/originals/28/35/2f/28352f4f85ebb3ff4019c0b4a2dd0092.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437041199992985/b5ae8413d8b1167720f3804fb58faaf8.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437061819170966/giphy.gif", "https://cdn.discordapp.com/attachments/987748619010576424/996437151367565392/Gvb.gif", "https://cdn.discordapp.com/attachments/987748619010576424/1000099809346211890/Untitled111.gif"];
                            const member = client.guilds.cache.get(guildId).members.cache.get(elem.id);
                            if (member) {
                                const embed_bday = new EmbedBuilder()
                                    .setColor('#ffd700')
                                    .setTitle('Joyeux Anniversaire ! 🎉')
                                    .setDescription(`Aujourd'hui c'est l'anniversaire de <@${member.user.id}> ! 🎈 🎂 🎊\n`)
                                    .setThumbnail(bdaygif[randomInt(0, 16)])
                                    .setFooter({
                                        text: 'Pensez à lui faire sa fête bande de BG',
                                        iconURL: `https://twemoji.maxcdn.com/v/latest/72x72/1f61c.png`
                                    })
                                client.guilds.cache.get(guildId).channels.fetch(channelBDayId).then(channel => {
                                    channel.send({embeds: [embed_bday]});
                                });
                            }
                        }
                    }
                });
            });
        }, {
            scheduled: true,
            timezone: "Europe/Paris"
        });
    }
}