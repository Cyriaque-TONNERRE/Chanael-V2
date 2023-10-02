const {QuickDB} = require("quick.db");
const db = new QuickDB();

const user_db = db.table("user");

function register_user(id){
    return new Promise( (resolve) => {
        user_db.set(id, {
            dateAnniv: {
                jour: 0,
                mois: 0,
                annee: 0
            }
        }).then(() => {
            resolve(true);
        });
    });
}

module.exports =  {register_user};