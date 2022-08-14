const {QuickDB} = require("quick.db");
const {register_user} = require("./register_user");

const db = new QuickDB();

const user_db = db.table("user");

async function addSanction(member, reason, modo, channel, link) {
    let sanction;
    if (link === undefined) {
        sanction = {
            reason: reason,
            timestamp: Date.now(),
            modo: modo.id,
            link: null
        }
    } else {
        sanction = {
            reason: reason,
            timestamp: Date.now(),
            modo: modo.id,
            link: link,
        }
    }
    if (!await user_db.has(member.id)) {
        register_user(member.id).then(r => {
            user_db.push(member.id + ".sanction", sanction).then(() => {
                user_db.add(member.id + ".nbSanction", 1).then(() => {
                    automute(member, channel);
                });
            });
        });
    } else {
        user_db.push(member.id + ".sanction", sanction).then(() => {
            user_db.add(member.id + ".nbSanction", 1).then(() => {
                automute(member, channel);
            });
        });
    }

}

function automute(member, channel) {
    user_db.get(member.id + ".nbSanction").then( nb_sanction => {
        if ((nb_sanction) >= 10) {
            member.timeout(7 * 24 * 60 * 60 * 1000, "Auto-Sanction");
            channel.send(`${member.displayName} a été réduit au silence 7 jours pour avoir commis ${nb_sanction} infractions au règlement.`);
        } else if ((nb_sanction) === 7) {
            member.timeout(3 * 24 * 60 * 60 * 1000, "Auto-Sanction");
            channel.send(`${member.displayName} a été réduit au silence 3 jours pour avoir commis 7 infractions au règlement.`);
        } else if ((nb_sanction) === 5) {
            member.timeout(24 * 60 * 60 * 1000, "Auto-Sanction");
            channel.send(`${member.displayName} a été réduit au silence 1 jours pour avoir commis 5 infractions au règlement.`);
        } else if ((nb_sanction) === 3) {
            member.timeout(60 * 60 * 1000, "Auto-Sanction");
            channel.send(`${member.displayName} a été réduit au silence 1 heure pour avoir commis 3 infractions au règlement.`);
        } else {
            channel.send(`${member.displayName} a commis ${nb_sanction} infractions au règlement.`);
        }
    });
}

module.exports = {addSanction};