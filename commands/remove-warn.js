const { SlashCommandBuilder, Events, ModalBuilder } = require('discord.js');
const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-warn')
        .setDescription(`Permet de retirer un warn.`)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Utilisateur qui va recevoir les Octets.')
                .setRequired(true),
        ),

    async execute(interaction) {
        if (verificationpermission(interaction)){
            const member = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
            if (await user_db.has(member.id)) {
                let liste_warn = await user_db.get(member.id + `.sanction`);
                if (liste_warn.length > 0){
                    // Afficher la liste des warns dans un modal
                    const modal = new ModalBuilder()
                        .setCustomId('myModal')
                        .setTitle('My Modal');
                    await interaction.showModal(modal);
                }
            }
        }
    }
}