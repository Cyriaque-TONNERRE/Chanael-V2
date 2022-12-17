const {SlashCommandBuilder} = require("discord.js");
const {roleDelegueId} = require("../config.json");
const {verificationpermission} = require("../fonctions/verificationpermission");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Permet de demute un utilisateur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à demute.')
                .setRequired(true)),

    async execute(interaction) {
        if(interaction.member.roles.cache.has(roleDelegueId) || verificationpermission(interaction)) {
            console.log("Perm c'est bon")
            const user = interaction.options.getUser('utilisateur');
            if (!(user.communicationDisabledUntilTimestamp !== null) || user.communicationDisabledUntilTimestamp < new Date().getTime()) {
                interaction.reply({content: `L'utilisateur n'est pas mute !`, ephemeral: true});
            } else {
                user.communicationDisabledUntilTimestamp = new Date().getTime();
                interaction.reply({content: `L'utilisateur a bien été demute.`, ephemeral: true});
            }
        } else {
            interaction.reply({content :"Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true});
        }
    },
};
