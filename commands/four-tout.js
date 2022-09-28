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
        interaction.reply({content: "Fait pas ça, tu vas tout casser !", ephemeral: true});
    },
};
