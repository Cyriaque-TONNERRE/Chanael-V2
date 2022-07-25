const {fcollector} = require("../fonctions/new_user");
const {channelRulesId} = require("../config.json");
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        let nom, prenom;
        nom = user_db.get(interaction.member.id + ".nom").then(() => {
            prenom = user_db.get(interaction.member.id + ".prenom");
        });
        if (!interaction.isButton()) return;

        if (interaction.customId === `validate`) {
            interaction.member.setNickname(`${prenom} ${nom}`).then(() => {
                interaction.guild.channels.cache.find(channel => channel.id === channelRulesId).permissionOverwrites.create(interaction.member.id, {
                    ViewChannel: true,
                }).then(() => {
                    interaction.channel.delete();
                });
            });
        }

        if (interaction.customId === `cancel`) {
            interaction.reply(`Quel est ton Prénom ?`);
            fcollector(interaction.channel,interaction.member);
        }
    }
}