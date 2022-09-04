const {register_user} = require('../fonctions/register_user.js');
const {categoryLoginId, roleModoId} = require('../config.json');

const {PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const {fcollector} = require("../fonctions/new_user");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        if (channel.topic.startsWith("Salon-perso-")) {
            let id = channel.topic.split("-")[2];
            await user_db.delete(id + ".channelPerso");
        }
    }
}