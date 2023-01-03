const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {fcollector} = require("../fonctions/new_user");
const {channelWelcomeId, roleTempId, newMemberRolesId, tiersRolesId, groupeRoles, tempRoleId, roleModoId, roleAdminId, roleDelegueId} = require("../config.json");
const {randomInt, forEach} = require("mathjs");
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const {register_user} = require("../fonctions/register_user");

const db = new QuickDB();

const user_db = db.table("user");

const with_perms = [roleModoId, roleAdminId, roleDelegueId];

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
   • D'envoyer les commandes dans le salon <#1015941248638537818> mis à votre disposition.
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
                if (!interaction.member.roles.cache.has(roleTempId)) {
                    await interaction.member.roles.add(roleTempId);
                    interaction.reply({content: 'Vous avez accepté le règlement.', ephemeral: true});
                    const chooseRoleButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('cir2')
                            .setLabel('CIR 2')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('cnb2')
                            .setLabel('CNB 2')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('cir1')
                            .setLabel('CIR 1')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('cnb1')
                            .setLabel('CNB 1')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('autre')
                            .setLabel('Autre')
                            .setStyle(ButtonStyle.Danger),
                    );
                    interaction.channel.send({content: 'Choisissez votre rôle !', components: [chooseRoleButton]});
                    if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                        const bienvenue = [
                            `J’aperçois ${interaction.member.displayName} qui nous rejoins !`,
                            `Ne paniquez pas, restez calme … c’est juste ${interaction.member.displayName} qui nous rejoins !`,
                            `:bruit_de_fanfare: ${interaction.member.displayName} a rejoins la bande !`,
                            `Hissez la grand'voile, ${interaction.member.displayName} est monté à bord !`,
                            `Si le pain d’épice fond, ${interaction.member.displayName} n’est pas loin !`,
                            `La légende disait vrai … ${interaction.member.displayName} a remué ciel et terre pour venir parmi les siens !`,
                            `Est-ce un mirage ? Non j’ai bien l’impression que ${interaction.member.displayName} viens d’entrer ici !`,
                            `Et c’est ${interaction.member.displayName} qui entre sur le dance floor !`
                        ]
                        const embed_bienvenue = new EmbedBuilder()
                            .setColor('#cc532e')
                            .setTitle('Ho ! Un nouveau membre !')
                            .setDescription(`${bienvenue[randomInt(0, 8)]}\nBienvenue sur le serveur de Promo 67 ! :beers:\n`)
                            .setImage('http://cyriaque.tonnerre.free.fr/joinimg.png')
                        interaction.guild.channels.fetch(channelWelcomeId).then(channel => {
                            channel.send({
                                content: `<@${interaction.member.user.id}>`,
                                embeds: [embed_bienvenue]
                            });
                        });
                    }
                } else {
                    interaction.reply({content: 'Vous avez déjà accepté le règlement.', ephemeral: true});
                }
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

        // Partie creation d'un salon temporaire

        if (interaction.customId === `createChannel`) {
            if (!await user_db.has(interaction.member.id)) {
                register_user(interaction.member.id).then(() => {
                    CreateChannel(interaction);
                });
            } else {
                await CreateChannel(interaction);
            }

        }

        // Partie suppression d'un salon temporaire

        if (interaction.customId === `deleteChannel`) {
            if (await user_db.get(interaction.member.id + ".channelPerso") !== undefined) {
                if (await user_db.get(interaction.member.id + ".channelPerso") === interaction.channel.id) {
                    const channel = interaction.guild.channels.cache.get(await user_db.get(interaction.member.id + ".channelPerso"));
                    channel.delete();
                    await user_db.delete(interaction.member.id + ".channelPerso");
                } else {
                    interaction.reply({content: 'Vous n\'avez pas le droit de supprimer ce salon !', ephemeral: true});
                }
            } else {
                interaction.reply({content: 'Vous n\'avez pas le droit de supprimer ce salon !', ephemeral: true});
            }
        }

        // Partie choix role Arrivée

        if (interaction.customId === `cir2`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[0]).then(() => {
                    interaction.member.roles.remove(roleTempId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CIR2 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }
        if (interaction.customId === `cnb2`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[1]).then(() => {
                    interaction.member.roles.remove(roleTempId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CNB2 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }
        if (interaction.customId === `cir1`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[3]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CIR1 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }
        if (interaction.customId === `cnb1`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[4]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CNB1 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }
        if (interaction.customId === `autre`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                const autreButton = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('cpg2')
                            .setLabel('CPG 2')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('cpg1')
                            .setLabel('CPG 1')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('autre_isen')
                            .setLabel('Année Sup ISEN')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('externe')
                            .setLabel('Externe (pas/plus ISEN)')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('prof')
                            .setLabel('Prof')
                            .setStyle(ButtonStyle.Danger),
                    );
                interaction.reply({content: 'Quel est votre role ?', components: [autreButton], ephemeral: true});
            }
        }

        if (interaction.customId === `cpg1`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[5]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CPG 1 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }

        if (interaction.customId === `cpg2`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[2]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role CPG 2 !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }

        if (interaction.customId === `autre_isen`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[7]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role Vieille Brindille !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }

        if (interaction.customId === `externe`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                await interaction.member.roles.add(newMemberRolesId[6]).then(() => {
                    interaction.member.roles.remove(tempRoleId);
                    interaction.reply({content: 'Vous avez bien été ajouté au role Parti Trop Tôt !', ephemeral: true});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            setTimeout(() => {
                                interaction.channel.delete();
                            }, 5000);
                        }
                    }
                });
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }

        if (interaction.customId === `prof`) {
            if (!interaction.member.roles.cache.hasAny(...newMemberRolesId)) {
                interaction.guild.channels.cache.get('948552469066178560').send(`||@everyone|| ALERT PROF : <@${interaction.member.id}> a voulu se connecter en tant que Prof !`);
                interaction.reply({content: 'Votre demande a bien été prise en compte, nous vous re-contacterons d\'ici peu!', ephemeral: true});
                setTimeout(() => {
                    interaction.member.kick({reason:`Votre demande a bien été prise en compte, nous vous re-contacterons d'ici peu!`});
                    if (interaction.channel.topic !== null) {
                        if (interaction.channel.topic.startsWith("enregistrement-")) {
                            interaction.channel.delete();
                        }
                    }
                }, 10000);
            } else {
                interaction.reply({content: 'Vous possedez déja un role pour 2022/2023!', ephemeral: true});
            }
        }

        // Choix role Groupe
        if (interaction.customId === `tiers1`) {
            await interaction.user.member.roles.remove(tiersRolesId);
            await interaction.user.member.roles.add(tiersRolesId[0]);
            interaction.reply({content:`Vous avez obtenue le role ${interaction.guild.roles.cache.get(tiersRolesId[0]).name} !`});
        }

        if (interaction.customId === `tiers2`) {
            await interaction.user.member.roles.remove(tiersRolesId);
            await interaction.user.member.roles.add(tiersRolesId[1]);
            interaction.reply({content:`Vous avez obtenue le role ${interaction.guild.roles.cache.get(tiersRolesId[1]).name} !`});
        }

        if (interaction.customId === `tiers3`) {
            await interaction.user.member.roles.remove(tiersRolesId);
            await interaction.user.member.roles.add(tiersRolesId[2]);
            interaction.reply({content:`Vous avez obtenue le role ${interaction.guild.roles.cache.get(tiersRolesId[2]).name} !`});
        }

        if (interaction.customId === `groupeA`) {
            await interaction.user.member.roles.remove(groupeRoles);
            await interaction.user.member.roles.add(groupeRoles[0]);
            interaction.reply({content:`Vous avez obtenue le role ${interaction.guild.roles.cache.get(groupeRoles[0]).name} !`});
        }

        if (interaction.customId === `groupeB`) {
            await interaction.user.member.roles.remove(groupeRoles);
            await interaction.user.member.roles.add(groupeRoles[1]);
            interaction.reply({content:`Vous avez obtenue le role ${interaction.guild.roles.cache.get(groupeRoles[1]).name} !`});
        }
    }
}


async function CreateChannel(interaction) {
    if (await user_db.get(interaction.member.id + ".channelPerso") === undefined) {
        interaction.channel.clone({name : "salon-de-" + interaction.member.displayName }).then(async channel => {
            channel.setTopic("Salon-perso-" + interaction.member.id).then(() => {
                forEach(newMemberRolesId, role => {
                    channel.permissionOverwrites.create(interaction.guild.roles.cache.get(role), {
                        ViewChannel: true,
                        SendMessages: true,
                        EmbedLinks: true,
                        AttachFiles: true,
                        ReadMessageHistory: true
                    });
                });
                forEach(with_perms, role => {
                    channel.permissionOverwrites.create(interaction.guild.roles.cache.get(role), {
                        ManageChannels: true
                    });
                });
                const deleteChannel = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('deleteChannel')
                            .setLabel('Supprimer le salon')
                            .setStyle(ButtonStyle.Danger)
                    );
                channel.send({content: `<@${interaction.member.id}>, ton salon a été créé ! Utilise le bouton ci-dessous pour le supprimer.`, components: [deleteChannel]});
            });
            const accessNewChannel = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Accéder au salon')
                        .setStyle(ButtonStyle.Link)
                        .setURL(channel.url),
                );
            await user_db.set(interaction.member.id + ".channelPerso", channel.id);
            interaction.reply({content: 'Vous avez créé un salon temporaire.',components: [accessNewChannel], ephemeral: true});
        });
    } else {
        const accessChannel = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Y accéder')
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/channels/899641565629284384/" + await user_db.get(interaction.member.id + ".channelPerso")),
            );
        interaction.reply({content: 'Vous avez déjà un salon temporaire.',components: [accessChannel], ephemeral: true});
    }
}