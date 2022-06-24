const mysql = require('mysql');
export class Database {

    constructor() {
        this.host = 'localhost';
        this.username = 'root';
        this.password = 'root';
        this.database = 'shopping_web'
        this.charset = 'utf8_general_ci'
    }
    connection() {
        return mysql.createConnection({
            'host': this.host,
            'username': this.username,
            'password': this.password,
            'database': this.database,
            'charset': this.charset
        })
    }
}
module.exports = Database;