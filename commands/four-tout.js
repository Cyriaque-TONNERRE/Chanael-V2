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
        /*
        const nouvelleAnnee = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('CIR3')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('cir3'),
            new ButtonBuilder()
                .setLabel('CNB3')
                .setStyle(ButtonStyle.Success)
                .setCustomId('cnb3'),
            new ButtonBuilder()
                .setLabel('CPG3')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('cpg3'),
            new ButtonBuilder()
                .setLabel('Parti trop tôt')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('externe')
        );
        interaction.channel.send({
            content: `Si jamais des <@&900811941080096779> auraient redoublé ou nous auraient quittés :`,
            components: [nouvelleAnnee],
            ephemeral: false
        });
        */
        interaction.reply({content: "Fait pas ça, tu vas tout casser !", ephemeral: true});
    },
};
