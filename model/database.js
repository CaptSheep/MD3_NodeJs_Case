const mysql = require('mysql')
class Database {
    constructor() {}
    connection() {
        return mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            port: '8889',
            database: 'shopping_web',
            charset: 'utf8_general_ci',
            // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
        });
    }

}
module.exports = Database