const cron = require('node-cron');
const fs = require('fs');

module.exports = {
    name: 'backup',
    execute() {
        cron.schedule('0 0 * * *', async () => {
            // Si le dossier backup n'existe pas, le créer
            if (!fs.existsSync('./backup')) {
                fs.mkdirSync('./backup');
            }
            // Backup de la base de données
            fs.copyFile('./json.sqlite', './backup/' + new Date().getTime().toString() + '.sqlite', (err) => {
                if (err) throw err;
                console.log('Fichier de backup créé !');
            });
            // S'il y a plus de 7 fichiers de backup, on supprime le plus ancien
            fs.readdir('./backup', (err, files) => {
                if (err) throw err;
                if (files.length > 7){
                    fs.unlink('./backup/' + files[0], (err) => {
                        if (err) throw err;
                        console.log('Fichier de backup supprimé !');
                    });
                }
            });

        }, {
            scheduled: true,
            timezone: "Europe/Paris"
        });
    }
}