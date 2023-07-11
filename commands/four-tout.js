const { SlashCommandBuilder, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,SelectMenuBuilder} = require('discord.js');
const {randomInt, forEach} = require("mathjs");
const {guildId, channelBDayId} = require("../config.json");
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();
const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('four-tout')
        .setDescription('Execute du code pour le fun.'),
    async execute(interaction) {
        const nouvelleAnnee = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('CIR2')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('stillCIR2'),
            new ButtonBuilder()
                .setLabel('CIR3')
                .setStyle(ButtonStyle.Success)
                .setCustomId('goToCIR3'),
            new ButtonBuilder()
                .setLabel('Parti trop tôt')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('byebye')
        );
        interaction.channel.send({
            content: `Que faites vous l'année prochaine ?`,
            components: [nouvelleAnnee],
            ephemeral: false
        });
        //interaction.reply({content: "Fait pas ça, tu vas tout casser !", ephemeral: true});
    },
};
