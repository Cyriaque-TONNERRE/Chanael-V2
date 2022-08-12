const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {QuickDB} = require("quick.db");
const {categoryTicketId, roleModoId} = require("../config.json");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Créer un ticket.'),
    async execute(interaction) {
        const member = interaction.member;
        if (await user_db.get(member.id + ".ticket") === undefined) {
            interaction.guild.channels.create({
                name: `ticket-${member.displayName}`,
                type: 0,
                parent: categoryTicketId,
                topic: "ticket-"+member.id,
            }).then(channel => {
               user_db.set(member.user.id + ".ticket", channel.id).then(() => {
                   interaction.reply({content: `Votre ticket a bien été créé.`, ephemeral: true}).then(() => {
                       channel.permissionOverwrites.create(interaction.member, {
                           ViewChannel: true,
                           SendMessages: true,
                           EmbedLinks: true,
                           AttachFiles: true,
                           ReadMessageHistory: true
                       }).then(() => {
                           channel.permissionOverwrites.create(interaction.guild.roles.cache.find(role => role.id === roleModoId), {
                               ViewChannel: true,
                               SendMessages: true,
                               EmbedLinks: true,
                               AttachFiles: true,
                               ReadMessageHistory: true
                           }).then(() => {
                               const row = new ActionRowBuilder().addComponents(
                                   new ButtonBuilder()
                                       .setCustomId('end_ticket')
                                       .setLabel('Fermer le ticket')
                                       .setStyle(ButtonStyle.Danger)
                               );
                               channel.send({content: `Bienvenue <@${interaction.user.id}> dans votre ticket.`, components: [row]});
                           });
                       });
                   });
               });
            });
        } else {
            interaction.reply({content: 'Vous avez déjà un ticket ouvert.', ephemeral: true});
        }
    },
};
