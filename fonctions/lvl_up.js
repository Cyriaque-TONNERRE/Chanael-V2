const {lvlRolesId} = require("../config.json");
const {QuickDB} = require("quick.db");
const db = new QuickDB();
const {round, pow} = require("mathjs");
const user_db = db.table("user");

function lvl_up(guild, id){
    return new Promise( async (resolve) => {
        let xp = await user_db.get(id + ".xp");
        let lvl = parseInt(await user_db.get(id + ".level"));
        if (xp >= round((3.5 * lvl + 500) * (pow(1.02, lvl)))) {
            user_db.set(id + ".xp", xp - round((3.5 * lvl + 500) * (pow(1.02, lvl)))).then(() => {
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
                    guild.members.fetch(id).then((member) => {
                        if (lvl + 1 === 10) {
                            member.roles.add(lvlRolesId[0]);
                        } else if (lvl + 1 === 20) {
                            member.roles.remove(lvlRolesId[0]);
                            member.roles.add(lvlRolesId[1]);
                        } else if (lvl + 1 === 30) {
                            member.roles.remove(lvlRolesId[1]);
                            member.roles.add(lvlRolesId[2]);
                        } else if (lvl + 1 === 40) {
                            member.roles.remove(lvlRolesId[2]);
                            member.roles.add(lvlRolesId[3]);
                        } else if (lvl + 1 === 50) {
                            member.roles.remove(lvlRolesId[3]);
                            member.roles.add(lvlRolesId[4]);
                        }
                    });
                });
            });
        } else resolve(false);
    });
}

module.exports = {lvl_up};