const { SlashCommandBuilder} = require('discord.js');
const { verificationpermission } = require("../fonctions/verificationpermission");
const {QuickDB} = require("quick.db");

const db = new QuickDB();
const onerole_db = db.table("onerole");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('swaprole')
        .setDescription('Échange le propriaitaire d\'un role unique.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à qui vous souhaitez créer un ticket.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Le rôle à ajouter.')
                .setRequired(true)
                .addChoices(
                    {name: "Best Punch", value: "934124797691068477"},
                    {name: "Culturé", value: "914216512309575710"}
                )),
    async execute(interaction) {
        if (verificationpermission(interaction)) {
            const pseudo = interaction.options.getUser("user");
            const role = interaction.options.getString("role");
            const member = interaction.guild.members.cache.get(pseudo.id);
            const role_to_add = interaction.guild.roles.cache.get(role);
            let member_target;
            if (!await onerole_db.has(role)) {
                onerole_db.set(role, member.id).then(() => {
                    member.roles.add(role_to_add).then(() => {
                        interaction.reply({
                            content: `Le role ${role_to_add.name} a bien été attribué à ${member.displayName}.`,
                            ephemeral: true
                        });
                    });
                });
            } else {
                onerole_db.get(role).then(target => {
                    member_target = interaction.guild.members.cache.get(target);
                    member_target.roles.remove(role_to_add);
                    onerole_db.set(role, member.id).then(() => {
                        member.roles.add(role_to_add).then(() => {
                            interaction.reply({
                                content: `Le role ${role_to_add.name} a bien été attribué à ${member.displayName}.`,
                                ephemeral: true
                            });
                        });
                    });
                })
            }
        }
    },
};
