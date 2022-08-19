const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { roleModoId, roleAdminId } = require('../config.json');
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const {addSanction} = require("../fonctions/addSanctionMute");
const {clientId} = require("../config.json");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription(`Ajoute un avertissement à un utilisateur.`)
        .addUserOption(option =>
            option.setName('pseudo')
                .setDescription('L\'utilisateur concerné.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison de l\'avertissement.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Lien de d\'une preuve.')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (verificationpermission(interaction)) {
            const membre = interaction.guild.members.cache.get(interaction.options.getUser('pseudo').id);
            if (membre.roles.cache.has(roleModoId) || membre.roles.cache.has(roleAdminId) || membre.permissions.has(PermissionFlagsBits.Administrator)) {
                interaction.reply({
                    content: `Vous ne pouvez pas warn un modérateur ou un administrateur.`,
                    ephemeral: true
                });
            } else {
                const reason = interaction.options.getString('raison');
                const link = interaction.options.getString('link');
                if (link === null) {
                    addSanction(membre, reason, interaction.member, interaction.channel);
                } else {
                    addSanction(membre, reason, interaction.member, interaction.channel, link);
                }
                const sanctionEmbed = new EmbedBuilder()
                    .setColor('#da461a')
                    .setTitle(`${membre.displayName} à été sanctionné par ${interaction.member.displayName}`)
                    .setThumbnail(membre.user.displayAvatarURL())
                    .addFields({
                        name: `Raison :`,
                        value: `${reason}`,
                    })
                    .setTimestamp()
                    .setFooter({text: 'Chanael', iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL()});
                interaction.reply({embeds: [sanctionEmbed]});
            }
        }
    },
};
