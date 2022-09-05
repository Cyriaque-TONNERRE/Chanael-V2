const {QuickDB} = require("quick.db");
const {register_user} = require("../fonctions/register_user");
const {randomInt} = require("mathjs");
const {lvl_up} = require("../fonctions/lvl_up");
const {EmbedBuilder} = require("discord.js");
const {channelBotId, clientId} = require("../config.json");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        if (!await user_db.has(message.author.id)) {
            register_user(message.author.id).then(async () => {
                await user_db.set(message.author.id + ".money", randomInt(5, 16));
                await user_db.set(message.author.id + ".xp", randomInt(3, 12));
                await user_db.set(message.author.id + ".lastMessage", new Date().getTime());
            });
        } else {
            if (await user_db.get(message.author.id + ".lastMessage") + 1000 < new Date().getTime()) {
                const lvl = await user_db.get(message.author.id + ".level");
                await user_db.add(message.author.id + ".money", randomInt(5,16));
                await user_db.set(message.author.id + ".lastMessage", new Date().getTime());
                user_db.add(message.author.id + ".xp", randomInt(3,12)).then(() => {
                    lvl_up(message.guild, message.author.id).then((isUP) => {
                        if (isUP) {
                            let lvlupEmbed = new EmbedBuilder()
                                .setColor('#0162b0')
                                .setTitle(`Bravo ${message.guild.members.cache.get(message.author.id).displayName} !`)
                                .setThumbnail(message.author.displayAvatarURL())
                                .setDescription(`Vous avez atteint le niveau ${lvl + 1} !`)
                                .setTimestamp()
                                .setFooter({ text: 'Chanael', iconURL: message.guild.members.cache.get(clientId).displayAvatarURL()});
                            message.guild.channels.cache.get(channelBotId).send({embeds: [lvlupEmbed]});
                        }
                    });
                });
            }
        }
    }
}