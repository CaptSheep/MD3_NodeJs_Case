let Database = require("./Database.js");

class UserModel {

    constructor() {
        let db = new Database()
        this.conn = db.connection();
    }

}