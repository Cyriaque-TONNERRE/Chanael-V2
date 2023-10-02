const {roleModoId, roleAdminId, roleDelegueId} = require('../config.json');

function verificationpermission(interaction) {
    if (interaction.member.roles.cache.has(roleModoId) || interaction.member.roles.cache.has(roleAdminId) || interaction.member.roles.cache.has(roleDelegueId)) {
        return true;
    } else {
        interaction.reply({content :"Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true});
        return false;
    }
}

module.exports = {verificationpermission};