const cookie = require('cookie')
const Database = require('./Database');
const fs = require('fs');
const AuthController = require('../controller/authController');
module.exports = class User {
    constructor() {

        this.db = new Database
        this.conn = this.db.connection();
        this.authController = new AuthController

    }
    showForm(req, res, pathFile) {
        fs.readFile(pathFile, 'utf-8', (err, data) => {
            if (err) {
                throw new Error(err.message);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        })
    }

    login(req, res) {

        if (req.method === 'GET') {
            let cookies = (cookie.parse(req.headers.cookie || ''))
            let nameCookie = '';
            if (cookies.cookie_user) {
                nameCookie = (JSON.parse(cookies.cookie_user)).session_name_file
                fs.existsSync('./session' + nameCookie + '.txt', (exists) => {
                    if (exists) {
                        console.log(exists)
                        res.writeHead(301, { Location: '/home' });
                        res.end();
                    } else {
                        this.showForm(req, res, './views/login.html')
                    }
                });

            } else {
                this.showForm(req, res, './views/login.html')


            }

        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            });
            req.on('end', () => {
                let result = qs.parse(data);
                this.authController.checkAcount(result.email, result.password).then(item => {
                    if (item.length > 0) {
                        //tao luu file session
                        let nameFile = Date.now();
                        //tao session login
                        let sessionLogin = {
                            'session_name_file': nameFile,
                            'data_user_login': item[0]
                        };
                        //ghi file
                        fs.writeFile('./session' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
                                if (err) {
                                    throw new Error(err.message);
                                }
                            })
                            //tao cookie
                        let cookieLogin = {
                            'session_name_file': nameFile
                        }
                        res.setHeader('Set-cookie', cookie.serialize('cookie_user', JSON.stringify(cookieLogin)));
                        if (item[0].roleId === 1) {
                            res.writeHead(301, { location: '/home' })
                        }
                        res.end();

                    } else {
                        fs.readFile('./views/login.html', 'utf-8', (err, data) => {
                            if (err) {
                                throw new Error(err.message);
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                // data = data.replace('hidden', '')
                                res.write(data);
                                res.end();
                            }
                        })
                    }
                })

            })
        }
    }

}