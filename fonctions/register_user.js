const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

function register_user(id){
    user_db.set(id, {
        nom: "",
        prenom: "",
        money: 0,
        xp: 0,
        level: 0,
        lastMessage: null,
        lastDaily: null,
        nbSanction: 0,
        sanction: [],
        dateAnniv: {
            jour: 0,
            mois: 0,
            annee: 0
        },
        ticket: undefined,
        adminTicket: undefined
    })
    return true;
}

module.exports =  {register_user};