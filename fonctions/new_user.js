const regex = new RegExp(/[A-zÀ-ú]+[-|\s]?[A-zÀ-ú]*/gm)
const {clientId} = require('../config.json');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

let nom,prenom;
const filter = m => m.author.id !== clientId;

function fcollector(channel,member) {
    let toReturn;
    const collector = channel.createMessageCollector({filter, max:1, time: 31536000});
    collector.on('collect', m => {
        toReturn = m.content;
    });
    collector.on('end', () => {
        if (toReturn !== undefined) {
            console.log(toReturn);
            if (regex.test(toReturn)) {
                if (toReturn.match(regex)[0].length !== toReturn.length) {
                    console.log("No match");
                    channel.send(`Le prénom est incorrect, veuillez réessayer.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                    fcollector(channel, member);
                } else if (toReturn.length > 30 || toReturn.length < 3) {
                    console.log("No match");
                    channel.send(`Le prénom est trop long *ou trop court*. Il doit faire entre 3 et 30 caractères inclus.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                    fcollector(channel, member);
                } else {
                    prenom = toReturn.substring(0,1).toUpperCase() + toReturn.substring(1).toLowerCase();
                    channel.send(`Veuillez entrer votre nom.`);
                    fcollector2(channel,member);
                }
            } else {
                console.log("No match");
                channel.send(`Le prénom est incorrect, veuillez réessayer.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                fcollector(channel, member);
            }
        }
    });
}

function fcollector2(channel, member) {
    let toReturn;
    const collector = channel.createMessageCollector({filter, max:1, time: 31536000});
    collector.on('collect', m => {
        toReturn = m.content;
    });
    collector.on('end', () => {
        console.log(toReturn);
        if (toReturn !== undefined) {
            if (regex.test(toReturn)) {
                if (toReturn.match(regex)[0].length !== toReturn.length) {
                    console.log("No match");
                    channel.send(`Le nom est incorrect, veuillez réessayer.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                    fcollector2(channel, member);
                } else if (toReturn.length > 30 || toReturn.length < 3) {
                    channel.send(`Le nom est trop long *ou trop court*. Il doit faire entre 3 et 30 caractères inclus.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                    fcollector2(channel, member);
                } else {
                    nom = toReturn.substring(0, 1).toUpperCase() + toReturn.substring(1).toLowerCase();
                    //validation du nom et prénom par des boutons
                    user_db.set(member.id + ".nom", nom).then(() => {
                        user_db.set(member.id + ".prenom", prenom).then(() => {
                            const validationNom = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('validate')
                                        .setLabel('Oui')
                                        .setStyle(ButtonStyle.Success),
                                    new ButtonBuilder()
                                        .setCustomId('cancel')
                                        .setLabel('Non')
                                        .setStyle(ButtonStyle.Danger),
                                );
                            channel.send({
                                content: `Validez-vous le Prénom et le Nom :  ${prenom} ${nom} ?`,
                                components: [validationNom]
                            });
                        });
                    });
                }
            } else {
                console.log("No match");
                channel.send(`Le nom est incorrect, veuillez réessayer.\nSi vous pensez qu'il s'agit d'une erreur, contactez Siryak#5777.\nRessayez`);
                fcollector2(channel, member);
            }
        }
    });
}

module.exports = {fcollector};