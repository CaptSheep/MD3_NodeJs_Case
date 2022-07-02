const Database = require("../model/Database")

class AuthController {
    constructor() {
        this.table = 'users'
        this.db = new Database()
        this.conn = this.db.connection();
    }
    checkAcount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select email,password,roleId from ${this.table} where email = '${email}' and password = '${password}' and roleId = ${roleId}`;
            this.conn.query(sql, (err, result) => {
                if (err) {
                    reject(err.message);
                }
                resolve(result)
            })
        })
    }
}
module.exports = AuthController