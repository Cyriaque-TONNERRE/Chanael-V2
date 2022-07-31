const {EmbedBuilder} = require("discord.js");
const {fcollector} = require("../fonctions/new_user");
const {channelRulesId, mainRolesId, roleMainId, channelWelcomeId} = require("../config.json");
const {randomInt} = require("mathjs");
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");

const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isButton()) return;

        // Partie Rename

        if (interaction.customId === `validate`) {
            if (interaction.channel.name === interaction.member.user.username) {
                user_db.get(interaction.member.id + ".nom").then((nom) => {
                    user_db.get(interaction.member.id + ".prenom").then((prenom) => {
                        console.log(nom);
                        console.log(prenom);
                        interaction.member.setNickname(`${prenom} ${nom}`).then(() => {
                            interaction.guild.channels.cache.find(channel => channel.id === channelRulesId).permissionOverwrites.create(interaction.member.id, {
                                ViewChannel: true,
                            }).then(() => {
                                interaction.channel.delete();
                            });
                        });
                    });
                });
            } else {
                interaction.reply({content: 'Vous n\'avez pas le droit d\'interagir avec ce channel !', ephemeral: true});
            }
        }

        if (interaction.customId === `cancel`) {
            if (interaction.channel.name === interaction.member.user.username) {
                interaction.reply(`Quel est ton Prénom ?`);
                fcollector(interaction.channel, interaction.member);
            } else {
                interaction.reply({content: 'Vous n\'avez pas le droit d\'interagir avec ce channel !', ephemeral: true});
            }
        }

        // Partie Acceptation du règlement

        if (interaction.customId === `accept_reglement`) {
            let has_accepted = false;
            mainRolesId.forEach(role => {
                if (interaction.member.roles.cache.has(role)) {
                    has_accepted = true;
                }
            });
            if (!has_accepted) {
                interaction.guild.roles.fetch(roleMainId).then(role => {
                    interaction.member.roles.add(role).then(() => {
                        const bienvenue = ["Bienvenue", "Welcome", "Willkommen", "Bienvenidos", "Bem-vindo", "Witam", "Dobrodošli"]
                        const embed_bienvenue = new EmbedBuilder()
                            .setColor('#cc532e')
                            .setTitle('Ho ! Un nouveau membre !')
                            .setDescription(`${bienvenue[randomInt(0, 7)]} sur le serveur de Promo 67,5! :beers:\n`)
                            //.setThumbnail(interaction.member.user.displayAvatarURL())
                            .setImage('http://cyriaque.tonnerre.free.fr/joinimg.png')
                        interaction.guild.channels.fetch(channelWelcomeId).then(channel => {
                            channel.send({content: `<@${interaction.member.user.id}>`, embeds: [embed_bienvenue], ephemeral: true});
                        });
                    });
                });
            }
            interaction.reply({content: 'Vous avez accepté le règlement.', ephemeral: true});
        }

        // Partie Fin d'un ticket

        if (interaction.customId === `end_ticket`) {
            if (verificationpermission(interaction)) {
                const member = interaction.guild.members.cache.find(member => member.id === interaction.channel.topic);
                user_db.delete(member.id + ".ticket").then(() => {
                    interaction.channel.delete();
                });
            }
        }
    }
}