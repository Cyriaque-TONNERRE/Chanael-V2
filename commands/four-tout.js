const { SlashCommandBuilder, EmbedBuilder, Client } = require('discord.js');
const {randomInt, forEach} = require("mathjs");
const {guildId, channelBDayId} = require("../config.json");
const {QuickDB} = require("quick.db");
const db = new QuickDB();
const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('four-tout')
        .setDescription('Execute du code pour le fun.'),
    async execute(interaction) {
        interaction.reply({content: "RATIO : " + randomInt(0, 100) + "%"});
    },
};
