const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        if (channel.topic !== null && channel.topic !== undefined) {
            if (channel.topic.startsWith("Salon-perso-")) {
                let id = channel.topic.split("-")[2];
                await user_db.delete(id + ".channelPerso");
            }
        }
    }
}