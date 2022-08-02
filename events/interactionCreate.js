const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {fcollector} = require("../fonctions/new_user");
const {channelRulesId, mainRolesId,roleModoId , channelWelcomeId, categoryLoginId} = require("../config.json");
const {randomInt} = require("mathjs");
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");

const db = new QuickDB();

const user_db = db.table("user");

/*-----/!\------Attention-ce-fichier-ne-gère-que-les-boutons-----/!\----------*/

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isButton()) return;

        // Partie Rename

        if (interaction.customId === `validate`) {
            if (interaction.channel.name === interaction.member.user.username) {
                user_db.get(interaction.member.id + ".nom").then((nom) => {
                    user_db.get(interaction.member.id + ".prenom").then((prenom) => {
                        console.log(nom + " " + prenom);
                        interaction.member.setNickname(`${prenom} ${nom}`).then(() => {
                            interaction.guild.channels.cache.find(channel => channel.id === channelRulesId).clone(option => {
                                option
                                    .setName('reglement-'+interaction.member.id)
                                    .setParent(categoryLoginId)
                            }).then((channel) => {
                                channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                                    ViewChannel: false,
                                }).then(() => {
                                    channel.permissionOverwrites.create(interaction.member, {
                                        ViewChannel: true,
                                        SendMessages: false,
                                        ReadMessageHistory: true
                                    }).then(() => {
                                        channel.permissionOverwrites.create(interaction.guild.roles.cache.find(role => role.id === roleModoId), {
                                            ViewChannel: true,
                                            SendMessages: true,
                                            ReadMessageHistory: true
                                        }).then(() => {
                                            const embed_reglement = new EmbedBuilder()
                                                .setColor('#da461a')
                                                .setTitle('Acceptez le règlement de Promo 67, 5 pour accéder à l\'intégralité du serveur')
                                                .setDescription('Pour accepter le règlement du serveur veuillez interagir avec le bouton ci-dessous !\n')
                                            const accep_reglement = new ActionRowBuilder().addComponents(
                                                new ButtonBuilder()
                                                    .setCustomId('accept_reglement')
                                                    .setLabel('Accepter')
                                                    .setStyle(ButtonStyle.Success)
                                                    .setDisabled(),
                                            );
                                            channel.messages.fetch(channel.lastMessageId).then(message => {
                                                message.delete().then(() => {
                                                    channel.send({embeds: [embed_reglement], components: [accep_reglement]});
                                                    interaction.channel.delete();
                                                });
                                            });
                                        });
                                    });
                                });
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
            interaction.reply({content: 'Vous avez accepté le règlement.', ephemeral: true});            ;
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

        // Partie Fin d'un admin ticket

        if (interaction.customId === `end_admin_ticket`) {
            if (verificationpermission(interaction)) {
                const member = interaction.guild.members.cache.find(member => member.id === interaction.channel.topic.slice(6));
                user_db.delete(member.id + ".adminTicket").then(() => {
                    interaction.channel.delete();
                });
            }
        }
    }
}