const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {QuickDB} = require("quick.db");
const {round, pow} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('context-level')
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const member = interaction.targetMember;
        let lvl = await user_db.get(member.id + `.level`);
        // si lvl n'est pas un nombre, on le met à 0.
        if (isNaN(lvl)) {
            lvl = 0;
        }
        let xp = await user_db.get(member.id + `.xp`);
        // La meme chose pour xp
        if (isNaN(xp)) {
            xp = 0;
        }
        interaction.reply({content: `${member.displayName} est niveau ${lvl} ! (${xp}/${round((3.5 * lvl + 500) * (pow(1.02, lvl)))} xp)`, ephemeral: true});
    }
};
