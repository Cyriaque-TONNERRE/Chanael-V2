const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('money')
        .setType(ApplicationCommandType.User),

    async execute(interaction) {
        const member = interaction.targetMember;
        console.log(member);
        const money = await user_db.get(member.id + `.money`);
        interaction.reply({content: `${member.displayName} a ${money} <a:octet:1010177758250405888> !`, ephemeral: true});

    }
};
