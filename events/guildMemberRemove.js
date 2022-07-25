const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        if (await user_db.has(member.id)) {
            user_db.set(member.id + ".dateAnniv.jour", 0).then(() => {
                user_db.set(member.id + ".dateAnniv.mois", 0).then(async () => {
                    await user_db.set(member.id + ".dateAnniv.annee", 0);
                });
            });
        }
    }
}