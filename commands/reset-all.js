const {SlashCommandBuilder} = require("discord.js");
const {resetAllPassword} = require("../config.json")
const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

const {verificationpermission} = require("../fonctions/verificationpermission");
const {forEach} = require("mathjs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-all')
        .setDescription('Reset la money et l\'xp.')
        .addStringOption(option =>
            option.setName('mdp')
                .setDescription('Mot de passe')
        ),
    async execute(interaction) {
        if (verificationpermission(interaction)) {
            if (interaction.options.getString('mdp') === resetAllPassword) {
                user_db.all().then((list) => {
                    forEach(list, (elem) => {
                        user_db.set(elem.id + ".money", 0)
                        user_db.set(elem.id + ".xp", 0)
                        user_db.set(elem.id + ".level", 0)
                    })
                })
            } else {
                interaction.reply({content: "Mot de passe incorrect !", ephemeral: true})
            }
        }
    },
};
