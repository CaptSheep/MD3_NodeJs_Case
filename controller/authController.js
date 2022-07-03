const fs = require('fs')
const qs = require('qs')
const User = require("../model/user")
const cookie = require('cookie')

class AuthController {
    constructor() {
        this.userModel = new User()
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
    async login(req, res) {
        const buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        let admin = '';
        this.userModel.checkAccount(user.name, user.password).then(result => {
            console.log(result);
            if (result[0].length > 0) {
                let nameFile = Date.now();
                let sessionLogin = {
                    'session_name_file': nameFile,
                    'data_user_login': result[0]
                }
                fs.writeFile('./session' + nameFile + '.txt', JSON.stringify(sessionLogin), err => {
                    if (err) {
                        throw new Error(err.message);
                    }
                })
                let cookieLogin = {
                    id: result[0][0].id,
                    'session_name_File': nameFile
                }
                let admin = false;
                res.setHeader('set-cookie', cookie.serialize('cookie-app', JSON.stringify(cookieLogin)));
                result[0].forEach(item => {
                    if (item.roleId === 'Admin') {
                        admin = true;
                        res.writeHead(301, { Location: '/admin' });
                        res.end();
                    }
                })
                if (!admin) {
                    res.writeHead(301, { Location: '/home' });
                    res.end();
                }

            } else {
                res.writeHead(301, { Location: '/' });
                res.end();
            }

        });
    }
}
module.exports = AuthController