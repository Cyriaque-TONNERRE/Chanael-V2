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
                .setMaxLength(100)
                .setRequired(true)),

    async execute(interaction) {
        user_db.get(interaction.user.id + ".channelPerso").then(async (channel) => {
            if (channel === undefined) {
                interaction.reply({ content: `Vous n'avez pas de salon personnel !`, ephemeral: true});
            } else {
                //si le salon ne commence pas par "salon", on ne peut pas le renommer
                if (!interaction.guild.channels.cache.get(channel).name.startsWith("salon")) {
                    console.log(interaction.guild.channels.cache.get(channel).name);
                    interaction.reply({content: `Ce salon à deja était rename ! *(Pour changer son nom re-créez en un autre !)*`, ephemeral: true});
                } else {
                    interaction.reply({content: `Le salon est en train d'être renommé.`, ephemeral: true});
                    interaction.guild.channels.cache.get(channel).setName(interaction.options.getString('nom')).then(() => {
                        interaction.editReply({content: `Le salon a bien été renommé.`, ephemeral: true});
                    });
                }
            }
        });
    },
};
