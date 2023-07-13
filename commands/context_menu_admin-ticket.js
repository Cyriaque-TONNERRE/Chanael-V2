const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {QuickDB} = require("quick.db");
const {categoryTicketId, roleModoId} = require("../config.json");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('admin-ticket')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        if (verificationpermission(interaction)) {
            const member = interaction.targetMember;
            const admin = interaction.member;
            if (await user_db.get(member.id + ".adminTicket") === undefined) {
                await interaction.guild.channels.create({
                    name: `admin-ticket-${member.displayName}`,
                    type: 0,
                    parent: categoryTicketId,
                    topic: "admin-ticket-" + member.id,
                }).then(channel => {
                    user_db.set(member.user.id + ".adminTicket", channel.id).then(() => {
                        interaction.reply({content: `Votre ticket a bien été créé.`, ephemeral: true}).then(() => {
                            channel.permissionOverwrites.create(member, {
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
                                            .setCustomId('end_admin_ticket')
                                            .setLabel('Fermer le ticket')
                                            .setStyle(ButtonStyle.Danger)
                                    );
                                    channel.send({content: `Bienvenue <@${member.id}> dans le ticket de <@${admin.id}>.`, components: [row]});
                                });
                            });
                        });
                    })
                });
            } else {
                interaction.reply({content: 'Cet utilisateur a déjà un admin-ticket ouvert.', ephemeral: true});
            }
        }
    }
};
