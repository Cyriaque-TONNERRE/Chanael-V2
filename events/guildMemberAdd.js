const {register_user} = require('../fonctions/register_user.js');
const {categoryLoginId, roleModoId} = require('../config.json');

const {PermissionFlagsBits} = require('discord.js');

const {QuickDB} = require("quick.db");
const {fcollector} = require("../fonctions/new_user");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        if (!await user_db.has(member.id)) {
            register_user(member.id);
        }
        member.guild.channels.create({
            name: member.displayName,
            type: 0,
            parent: categoryLoginId,
            permissionOverwrites: [
                {
                    id: member.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        }).then(channel => {
            channel.permissionOverwrites.create(member, {
                ViewChannel: true,
                SendMessages: true,
                EmbedLinks: true,
                AttachFiles: true,
                ReadMessageHistory: true
            });
            channel.permissionOverwrites.create(member.guild.roles.cache.find(role => role.id === roleModoId), {
                ViewChannel: true,
                SendMessages: true,
                EmbedLinks: true,
                AttachFiles: true,
                ReadMessageHistory: true
            });
            channel.send(`Bienvenue <@${member.id}> sur le serveur de la Promo 67 !`);
            channel.send(`Attention à bien remplir ce formulaire, les informations données ne pourront être modifiées que par un modérateur.`);
            //demander le nom / prénom
            channel.send(`Quel est ton Prénom ?`);
            fcollector(channel,member);
        });
    }
}