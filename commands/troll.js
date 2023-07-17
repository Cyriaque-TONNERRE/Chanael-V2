const {SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require('discord.js');
const {verificationpermission} = require("../fonctions/verificationpermission");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('troll')
        .setDescription("undefined"),

    async execute(interaction) {
        if (verificationpermission(interaction)){
            const trollModal = new ModalBuilder()
                .setCustomId("trollModal")
                .setTitle("Troll via Webhook")
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("name")
                            .setLabel("Nom à utiliser")
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("Emmanuel Macron")
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("profilePicture")
                            .setLabel("PP à utiliser (Lien)")
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder("https://images.unsplash.com/photo-1575936123452-b67c3203c357")
                            .setMinLength(1)
                            .setRequired(false)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId("text")
                            .setLabel("Message à envoyer")
                            .setStyle(TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setRequired(true)
                    ),
                );
            await interaction.showModal(trollModal)
        }
    }
};

