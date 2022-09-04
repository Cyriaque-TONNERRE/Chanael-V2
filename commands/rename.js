const {ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const {SlashCommandBuilder} = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Permet de renomer son salon temporaire.')
        .addStringOption(option =>
            option.setName('nom')
                .setDescription('Le nom du salon.')
                .setRequired(true)),

    async execute(interaction) {
        user_db.get(interaction.user.id + ".channelPerso").then(async (channel) => {
            if (channel === undefined) {
                const createChannelButton = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('createChannel')
                        .setLabel('Créer un salon')
                        .setStyle(ButtonStyle.Primary),
                );
                interaction.reply({ content: `Vous n'avez pas de salon personnel, mais vous pouvez en créer un ci-dessous`, components: [createChannelButton], ephemeral: true});
            } else {
                await interaction.guild.channels.cache.get(channel).setName(interaction.options.getString('nom'));
                interaction.reply({content: `Le salon a bien été renommé.`, ephemeral: true});
            }
        });
    },
};
