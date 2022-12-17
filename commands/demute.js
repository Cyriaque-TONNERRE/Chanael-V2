const {SlashCommandBuilder} = require("discord.js");
const {verificationpermission} = require("../fonctions/verificationpermission");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Permet de demute un utilisateur.')
        .addUserOption(option =>
            option.setName('utilisateur')
                .setDescription('L\'utilisateur à demute.')
                .setRequired(true)),
    aliases: ["demute"],

    async execute(interaction) {
        if(verificationpermission(interaction)) {
            const member = interaction.guild.members.cache.get(interaction.options.getUser('utilisateur').id);
            if (!(member.communicationDisabledUntilTimestamp !== null) || member.communicationDisabledUntilTimestamp < new Date().getTime()) {
                interaction.reply({content: `L'utilisateur n'est pas mute !`, ephemeral: true});
            } else {
                member.timeout(null, "Demute par " + interaction.user.tag);
                interaction.reply({content: `L'utilisateur a bien été demute.`, ephemeral: true});
            }
        } else {
            interaction.reply({content :"Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true});
        }
    },
};
