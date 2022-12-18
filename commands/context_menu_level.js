const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {QuickDB} = require("quick.db");
const {round, pow} = require("mathjs");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('level')
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const member = interaction.targetMember;
        const lvl = await user_db.get(member.id + `.level`);
        const xp = await user_db.get(member.id + `.xp`);
        interaction.reply({content: `${member.displayName} est niveau ${lvl} ! (${xp}/${round((3.5 * lvl + 500) * (pow(1.02, lvl)))} xp)`, ephemeral: true});
    }
};
