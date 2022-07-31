/*---------------------------Outils-alternatif-----------------------------*/

const {QuickDB} = require("quick.db");  //Permet d'importer la base de données
const db = new QuickDB(); //Permet d'importer la base de données
const user_db = db.table("user"); //Permet d'importer la base de données

const {Nom_de_variable} = require("../config.json"); //Import d'une variable du fichier config.json

const {EmbedBuilder} = require("discord.js"); //Permet de créer des embeds

const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js'); //Permet de créer des boutons

const {verificationpermission} = require("../fonctions/verificationpermission"); //Import de la fonction de verification de permission

/*-------------------------------------------------------------------------*/

module.exports = {
    name: "nom_de_l'event",
     execute(resultat_de_levent) { //User/role/channel/message/guild/etc...
        // Ce que l'event va exécuté si il est détecter sur discord
    }
}