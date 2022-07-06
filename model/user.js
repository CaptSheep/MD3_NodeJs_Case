const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.db = new Database
        this.conn = this.db.connection();

    }
    checkAccount(email, password) {
        return new Promise((resolve, reject) => {
            let sql = `select email, password,roleId from users where email = '${email}' and password = '${password}'`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    getUserById(id) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM users WHERE id = " + id;
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    }
    createAccount(data) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO users (name, email, password, address, roleId,image)  VALUES('${data.name}','${data.email}','${data.password}','${data.address}',${data.roleId},'${data.image}')`
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }


}