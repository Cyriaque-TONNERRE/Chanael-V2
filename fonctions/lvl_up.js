const {QuickDB} = require("quick.db");
const db = new QuickDB();
const {round, pow} = require("mathjs");
const user_db = db.table("user");

function lvl_up(id){
    return new Promise( async (resolve) => {
        let xp = await user_db.get(id + ".xp");
        let lvl = parseInt(await user_db.get(id + ".level"));
        if (xp >= round((3.5 * lvl + 200) * (pow(1.05, lvl)))) {
            user_db.set(id + ".xp", xp - round((3.5 * lvl + 150) * (pow(1.05, lvl)))).then(() => {
                user_db.add(id + ".level", 1).then(async () => {
                    resolve(true);
                    if ((lvl + 1) % 5 === 0) {
                        if ((lvl + 1) % 10 === 0) {
                            await user_db.add(id + ".money", 250 * (lvl + 1)); // palier 10
                        } else {
                            await user_db.add(id + ".money", 100 * (lvl + 1)); // palier 5
                        }
                    } else {
                        await user_db.add(id + ".money", 25 * (lvl + 1)); // palier unitaire
                    }
                });
            });
        } else resolve(false);
    });
}

module.exports = {lvl_up};