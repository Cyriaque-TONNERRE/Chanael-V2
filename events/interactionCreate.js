const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {fcollector} = require("../fonctions/new_user");
const {mainRolesId, channelWelcomeId, roleMainId} = require("../config.json");
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
            if (interaction.channel.topic.slice(15) === interaction.member.id) {
                user_db.get(interaction.member.id + ".nom").then((nom) => {
                    user_db.get(interaction.member.id + ".prenom").then((prenom) => {
                        interaction.member.setNickname(`${prenom} ${nom}`).then(() => {
                            interaction.channel.clone({name:`reglement-${interaction.member.user.username}`}).then((channel) => {
                                channel.send(`
                                **Règlement du serveur de la promo 67, 5 :**

<:hat:927602853319675975> Il vous est demandé :
   • D'être respectueux, agréable et tolérant à l'égard de toutes et tous.
   • D'avoir un pseudo qui respecte strictement la convention suivante : "VotrePrénom VotreNom".
   • D'avoir une photo de profil qui respecte la vie privée de chacun.
   • D'envoyer les commandes dans le salon <#899645435566768209> mis à votre disposition.
   • De respecter les conditions d’utilisation de Discord : https://discord.com/terms

<:ban:900013099250241606> Il vous est interdit :
   • De mentionner inutilement une personne ou un rôle.
   • De spam, que ce soit par le biais de messages ou de gifs.
   • De publier du contenu NSFW (gore, porno, etc).
   • De faire de la pub, quelle que soit sa forme (YouTube, Discord, etc) sans la permission du staff.
   • De tenir des discours haineux, racistes, sexistes, homophobes et tout autres propos visant à harceler / rabaisser une personne ou une communauté.
   • De spoil (peut importe la véracité de l'information).
   • De rejoindre avec plusieurs comptes.
                                `).then(() => {
                                    channel.send(`
                                    :mega: __Note__ :
- *Ces règles s'appliquent à l'ensemble du serveur.
- La modération se garde le droit d'ajouter, d'enlever ou de modifier ce règlement à tout moment et sans avertissement, vous êtes ainsi tenus de rester informé des modifications de celui-ci.*

Afin de maintenir la convivialité sur ce serveur, des sanctions peuvent être appliqués lors de manquements répétés au règlement sous-nommé.

__Fonctionnement des sanctions :__

   • Une infraction = 1 warn.
   • 3 avertissements ⇒ Un mute temporaire de 6 heures.
   • 5 avertissements ⇒ Un mute temporaire de 1 jour.
   • 7 avertissements ⇒ Un mute temporaire de 3 jours.
   • 10 avertissements ⇒ Un mute temporaire de 1 semaine.

:warning: *En cas de problème, vous pouvez contacter le staff en ouvrant un \`/ticket\`.
Nous tenons à préciser que la sanction est à la discretion du modérateur !*
                                    `).then(() => {
                                        const embed_reglement = new EmbedBuilder()
                                            .setColor('#da461a')
                                            .setTitle('Acceptez le règlement de Promo 67, 5 pour accéder à l\'intégralité du serveur')
                                            .setDescription('Pour accepter le règlement du serveur veuillez interagir avec le bouton ci-dessous !\n')
                                        const accep_reglement = new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('accept_reglement')
                                                .setLabel('Accepter')
                                                .setStyle(ButtonStyle.Success)
                                        );
                                        channel.send({embeds: [embed_reglement], components: [accep_reglement]});
                                        interaction.channel.delete();
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
            if (interaction.channel.topic.slice(15) === interaction.member.id) {
                interaction.message.delete();
                interaction.reply(`Quel est ton Prénom ?`);
                fcollector(interaction.channel, interaction.member);
            } else {
                interaction.reply({content: 'Vous n\'avez pas le droit d\'interagir avec ce channel !', ephemeral: true});
            }
        }

        // Partie Acceptation du règlement

        if (interaction.customId === `accept_reglement`) {
            if (interaction.channel.topic.slice(15) === interaction.member.id) {
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
                                .setDescription(`${bienvenue[randomInt(0, 7)]} à ${interaction.member.displayName} sur le serveur de Promo 67,5! :beers:\n`)
                                .setImage('http://cyriaque.tonnerre.free.fr/joinimg.png')
                            interaction.guild.channels.fetch(channelWelcomeId).then(channel => {
                                channel.send({
                                    content: `<@${interaction.member.user.id}>`,
                                    embeds: [embed_bienvenue],
                                    ephemeral: true
                                }).then(() => {
                                    interaction.member.roles.add(roleMainId);
                                    setTimeout(() => {
                                        interaction.channel.delete();
                                    }, 5000);
                                });
                            });
                        });
                    });
                }
                interaction.reply({content: 'Vous avez accepté le règlement.', ephemeral: true});
            } else {
                interaction.reply({content: 'Vous n\'avez pas le droit d\'interagir avec ce channel !', ephemeral: true});
            }
        }


        // Partie Fin d'un ticket

        if (interaction.customId === `end_ticket`) {
            if (verificationpermission(interaction)) {
                const member = interaction.guild.members.cache.find(member => member.id === interaction.channel.topic.slice(7));
                user_db.delete(member.id + ".ticket").then(() => {
                    interaction.channel.delete();
                });
            }
        }

        // Partie Fin d'un admin ticket

        if (interaction.customId === `end_admin_ticket`) {
            if (verificationpermission(interaction)) {
                const member = interaction.guild.members.cache.find(member => member.id === interaction.channel.topic.slice(13));
                console.log(interaction.channel.topic.slice(6));
                user_db.delete(member.id + ".adminTicket").then(() => {
                    interaction.channel.delete();
                });
            }
        }
    }
}