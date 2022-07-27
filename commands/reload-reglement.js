const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {channelRulesId} = require("../config.json");
const {verificationpermission} = require("../fonctions/verificationpermission");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload-reglement')
        .setDescription('Reload la validation du règlement.'),
    async execute(interaction) {
        if (verificationpermission(interaction)) {
            const embed_reglement = new EmbedBuilder()
                .setColor('#da461a')
                .setTitle('Acceptez le règlement de Promo 67, 5 pour accéder à l\'intégralité du serveur')
                .setDescription('Pour accepter le règlement du serveur veuillez interagir avec le bouton ci-dessous !\n')
            const accep_reglement = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('accept_reglement')
                    .setLabel('Accepter')
                    .setStyle(ButtonStyle.Success),
            );
            const reglement_channel = interaction.guild.channels.cache.get(channelRulesId);
            reglement_channel.messages.fetch(reglement_channel.lastMessageId).then(message => {
                message.delete().then(() => {
                    reglement_channel.send({embeds: [embed_reglement], components: [accep_reglement]}).then(() => {
                        interaction.reply({content: 'Le règlement a été reload !', ephemeral: true});
                    });
                });
            });
        }
    },
};
