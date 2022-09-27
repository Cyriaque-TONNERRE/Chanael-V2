const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {roleModoId, roleAdminId} = require("../config.json");
const {randomInt} = require("mathjs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mehdi-mute')
        .setDescription('Mute un utilisateur pendant un certain temps.')
        .addUserOption(option =>
            option.setName('pseudo')
                .setDescription('L\'utilisateur concerné.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du mute.')
                .setRequired(true)
        ),

    execute(interaction) {
        if(interaction.member.id === "422807797525250079") {
            const user = interaction.guild.members.cache.get(interaction.options.getUser('pseudo').id);
            if (user.roles.cache.find(role => role.id === roleModoId) || user.roles.cache.find(role => role.id === roleAdminId) || user.permissions.has(PermissionFlagsBits.Administrator)) {
                interaction.reply({
                    content: `Vous ne pouvez pas mute un modérateur ou un administrateur.`,
                    ephemeral: true
                });
            } else {
                const reason = interaction.options.getString('raison');
                let timeToMute = randomInt(10 * 1000, 60 * 1000);
                if (user.communicationDisabledUntilTimestamp !== null) {
                    if (user.communicationDisabledUntilTimestamp > new Date().getTime()) {
                        timeToMute += user.communicationDisabledUntilTimestamp - Date.now();
                    }
                }
                let mehdi_mute_embeds = new EmbedBuilder();
                user.timeout(timeToMute, reason);
                mehdi_mute_embeds
                    .setColor('#da461a')
                    .setTitle(`${user.displayName} à été mute par ${interaction.member.displayName}`)
                    .setThumbnail(user.displayAvatarURL())
                    .addFields({
                        name: `Pendant :`,
                        value: `${timeToMute / 1000} secondes`
                    })
                    .setTimestamp()
                    .setFooter({text: 'Medhi', iconURL: interaction.guild.members.cache.get("422807797525250079").displayAvatarURL()});
                interaction.reply({embeds: [mehdi_mute_embeds]});
            }
        } else {
            interaction.reply({
                content: `Vous n'êtes pas Mehdi, vous ne pouvez pas utiliser cette commande.`,
                ephemeral: true
            });
        }
    },
};
