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

        let result = await this.userModel.checkAccount(user.email, user.password)
        result = JSON.parse(JSON.stringify(result))
        console.log(result);
        if (result.length > 0) {

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
                id: result[0].id,
                'session_name_File': nameFile
            }

            console.log(cookieLogin)
            let admin = false;
            res.setHeader('set-cookie', cookie.serialize('cookie-app', JSON.stringify(cookieLogin)));

            result.forEach(item => {
                if (item.roleId === 2) {
                    admin = true;
                    res.writeHead(301, { Location: '/admin' });
                    return res.end();
                }
            })
            if (!admin) {
                res.writeHead(301, { Location: '/home' });
                return res.end();
            }

        } else {
            res.writeHead(301, { Location: '/' });
            return res.end();
        }


    }
    async register(req, res) {
        let buffer = [];
        for await (const chunk of req) {
            buffer.push(chunk);
        }
        const data = Buffer.concat(buffer).toString();
        const user = qs.parse(data);
        this.userModel.createAccount(user).then(result => {
            res.writeHead(301, { Location: '/' });
            res.end();
        });
    }
    logout(req, res) {

        res.writeHead(301, { location: '/' });
        return res.end();
    }

}
module.exports = AuthController