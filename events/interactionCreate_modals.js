const {trollWebhook} = require("../config.json");
/*-----/!\------Attention-ce-fichier-ne-gère-que-les-boutons-----/!\----------*/

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === `trollModal`) {
            const pseudo = interaction.fields.getTextInputValue('name')
            const pp = interaction.fields.getTextInputValue('profilePicture');
            const text = interaction.fields.getTextInputValue('text');
            const data = {
                "content": text,
                "embeds": null,
                "username": pseudo,
                "avatar_url": pp,
                "attachments": []
            };
            fetch(trollWebhook, {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(data),
            }).then((response) => interaction.reply({content: `Status : ${response.status}`, ephemeral: true}))
            
        }
    }
}