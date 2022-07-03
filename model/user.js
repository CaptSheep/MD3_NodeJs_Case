const Database = require('./Database');

module.exports = class User {
    constructor() {
        this.db = new Database
        this.conn = this.db.connection();

    }
    checkAccount(name, password) {
        return new Promise((resolve, reject) => {
            let sql = `select name, password from users where name = '${name}' and password = '${password}'`
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
            let sql = 'INSERT INTO users(name, email, password, address, roleId,image)  VALUES(N\'' + data.name + '\', N\'' + data.email + '\', N\'' + data.password + '\', N\'' + data.address + '\', N\'' + data.roleId + ')'
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })

        })
    }


}