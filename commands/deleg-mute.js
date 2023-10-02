const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const {roleModoId, roleAdminId, clientId, roleDelegueId} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleg-mute')
        .setDescription('Mute un utilisateur pendant un certain temps.')
        .addUserOption(option =>
            option.setName('pseudo')
                .setDescription('L\'utilisateur concerné.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('durée')
                .setDescription('La durée du mute.')
                .setRequired(true)
                .setMinValue(1)
        )
        .addStringOption(option =>
            option.setName('unité')
                .setDescription('Unité de temps. (Max 28 jours / 4 semaines)')
                .setRequired(true)
                .addChoices(
                    {name: 'Minutes', value: 'Minutes'},
                    {name: 'Heures', value: 'Heures'},
                    { name: 'Jours', value: 'Jours' },
                    { name: 'Semaines', value: 'Semaines' }
                ),
        )
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Raison du mute.')
                .setRequired(true)
        ),

    execute(interaction) {
        if(interaction.member.roles.cache.has(roleDelegueId)) {
            const user = interaction.guild.members.cache.get(interaction.options.getUser('pseudo').id);
            if (user.roles.cache.find(role => role.id === roleModoId) || user.roles.cache.find(role => role.id === roleAdminId) || user.permissions.has(PermissionFlagsBits.Administrator)) {
                interaction.reply({
                    content: `Vous ne pouvez pas mute un modérateur ou un administrateur.`,
                    ephemeral: true
                });
            } else {
                const duration = interaction.options.getInteger('durée');
                const unite = interaction.options.getString('unité');
                const reason = interaction.options.getString('raison');
                let timeToMute = duration;
                let mute_embeds = new EmbedBuilder();
                if (unite === 'Minutes') {
                    timeToMute = timeToMute * 60 * 1000;
                }
                if (unite === 'Heures') {
                    timeToMute = timeToMute * 60 * 60 * 1000;
                }
                if (unite === 'Jours') {
                    timeToMute = timeToMute * 24 * 60 * 60 * 1000;
                }
                if (unite === 'Semaines') {
                    timeToMute = timeToMute * 7 * 24 * 60 * 60 * 1000;
                }
                if (user.communicationDisabledUntilTimestamp !== null) {
                    if (user.communicationDisabledUntilTimestamp > new Date().getTime()) {
                        timeToMute += user.communicationDisabledUntilTimestamp - Date.now();
                    }
                }
                if (timeToMute > 2419200000) {
                    timeToMute = 2419200000;
                    user.timeout(timeToMute, reason);
                    mute_embeds
                        .setColor('#da461a')
                        .setTitle(`${user.displayName} à été mute par ${interaction.member.displayName}`)
                        .setThumbnail(user.displayAvatarURL())
                        .addFields({
                            name: `Pendant :`,
                            value: `1 Mois (durée Max)`
                        })
                        .setTimestamp()
                        .setFooter({text: 'Chanael', iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL()});
                    interaction.reply({embeds: [mute_embeds]});
                } else {
                    user.timeout(timeToMute, reason);
                    mute_embeds
                        .setColor('#da461a')
                        .setTitle(`${user.displayName} à été mute par ${interaction.member.displayName}`)
                        .setThumbnail(user.displayAvatarURL())
                        .addFields({
                            name: `Pendant :`,
                            value: `${duration} ${unite}`
                        })
                        .setTimestamp()
                        .setFooter({text: 'Chanael', iconURL: interaction.guild.members.cache.get(clientId).displayAvatarURL()});
                    interaction.reply({embeds: [mute_embeds]});
                }
            }
        } else {
            interaction.reply({content:"Vous n'êtes pas délégué(e)", ephemeral:true})
        }
    },
};
