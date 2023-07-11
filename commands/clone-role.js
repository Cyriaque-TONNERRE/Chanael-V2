const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {verificationpermission} = require("../fonctions/verificationpermission");
const {roleAdminId, clientId} = require("../config.json");
const {addSanction} = require("../fonctions/addSanctionMute");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clone-role')
        .setDescription("Cloner les permission d'un role.")
        .addMentionableOption(option =>
            option.setName('role')
                .setDescription("Le rôle à copier.")
                .setRequired(true)
        ),

    execute(interaction) {
        if(verificationpermission(interaction)) {
            const roleToCopy = interaction.options.getMentionable('role');
            if (roleToCopy.color !== undefined) {
                interaction.guild.roles.create({
                    name: `copy of ${roleToCopy.name}`,
                    color: roleToCopy.color,
                    permissions: roleToCopy.permissions,
                    position: roleToCopy.position + 1,
                    mentionable: roleToCopy.mentionable
                }).then(() => {
                    interaction.reply({content: `Le rôle a bien été copié`, ephemeral: true})
                })
            } else {
                interaction.reply({content: `Ce n'est pas un rôle.`, ephemeral: true})
            }
        }
    },
};
