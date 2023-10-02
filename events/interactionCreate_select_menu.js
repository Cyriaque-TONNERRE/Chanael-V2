const {QuickDB} = require("quick.db");
const {verificationpermission} = require("../fonctions/verificationpermission");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isAnySelectMenu()) {return}

        if (interaction.customId === 'remove-warn') {
            if (verificationpermission(interaction)) {
                //Récupérer l'index du warn à retirer
                const index = interaction.values[0].split(" ")[0];
                //Récupérer l'id de l'utilisateur
                const id = interaction.values[0].split(" ")[1];
                //Récupérer le membre
                const membre = interaction.guild.members.cache.get(id);
                //Récupérer la liste des sanctions
                const list = await user_db.get(`${membre.id}.sanction`);
                //Supprimer la sanction
                list.splice(index, 1);
                //Enregistrer la nouvelle liste
                await user_db.set(`${membre.id}.sanction`, list);
                //Diminuer le nombre de sanctions
                await user_db.sub(`${membre.id}.nbSanction`,1);
                //Répondre à l'interaction
                interaction.reply({content: `La sanction a bien été retirée.`, ephemeral: true});
                //Supprimer le message
                interaction.message.delete();
            }
        }
    }
};