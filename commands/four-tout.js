const { SlashCommandBuilder, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
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
        if (verificationpermission(interaction)) {
            for (let i = 0; i < 100; i++) {
                interaction.channel.send({content: "La quantité de CO2 dans l’atmosphère a augmenté de 31% depuis 1750. Cette quantité n'a jamais été dépassée durant les derniers 20 millions d'années.\n" +
                        "\n" +
                        "On évalue que trois-quarts des émissions de CO2 dans l'atmosphère durant les 20 dernières années sont dues à la consommation des combustibles fossiles. Le quart restant est dû en grande partie à la déforestation.\n" +
                        "\n" +
                        "Actuellement, l’océan et les continents absorbent ensemble près de la moitié des émission \n" +
                        "humaines de CO2, l’autre moitié participe donc activement au réchauffement climatique. \n"});
            }
        }
    },
};
