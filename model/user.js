const { Database } = require("./database.js");

class User {

    constructor() {
        let db = new Database()
        let conn = db.connection()
    }
    getUser() {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM users';
            this.conn.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                }
                resolve(data);
            })
        })
    }
    getRoleUser() {
        return new Promise(((resolve, reject) => {
            let sql = "SELECT * FROM roles";
            this.conn.query(sql, (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data)
            })
        }))
    }
    insertUser(name, email, password, address, roleId, image) {
        return new Promise(((resolve, reject) => {
            let sql = `INSERT INTO users(name, email, password, address,roleId,image) 
                    VALUES ('${name}', '${email}', '${password}','${address}','${roleId}','${image}')`;
            this.conn.query(sql, err => {
                if (err) {
                    reject(err)
                }
                resolve('oke')
            })
        }))

    }
    insertRole(id, name) {
        let sql2 = `INSERT INTO roles(id, name) 
                    VALUES ('${id}', '${name}')`;
        this.conn.query(sql2, err => {
            if (err) {
                throw new Error(err.message);
            }
        })
    }

}
module.exports = User;