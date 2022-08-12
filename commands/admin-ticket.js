const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const {QuickDB} = require("quick.db");
const {categoryTicketId, roleModoId} = require("../config.json");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin-ticket')
        .setDescription('Créer un ticket.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à qui vous souhaitez créer un ticket.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (verificationpermission(interaction)) {
            const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
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
                interaction.reply({content: 'Cet utilisateur a déjà aun admin-ticket ouvert.', ephemeral: true});
            }
        }
    }
};
