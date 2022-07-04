const http = require('http');
const qs = require('qs');
const url = require('url')
const fs = require('fs');
const Database = require('./model/Database');
const PostModel = require('./model/posts');
const User = require('./model/user');
const AuthController = require('./controller/authController');

let database = new Database
let postModel = new PostModel
let user = new User
let authController = new AuthController
database.connection(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('DB Connection Success')
    }
})

const server = http.createServer(async(req, res) => {
    let parseUrl = url.parse(req.url);
    let path = parseUrl.pathname;

    switch (path) {
        case '/':
            if (req.method === 'GET') {
                authController.showForm(req, res, './views/login.html')
            } else {
                authController.login(req, res)
            }
            break;
        case '/register':
            if (req.method === 'GET') {
                authController.showForm(req, res, './views/register.html')
            } else {
                authController.register(req, res)
            }
            break;
        case '/home':
            if (req.method === "GET") {
                await postModel.showListPosts(req, res);
            }
            break;
        case '/admin':
            {
                authController.showForm(req, res, './views/admin.html')
            }
            break;
        case '/create':
            if (req.method === 'GET') {
                fs.readFile('./views/create.html', 'utf-8', (err, data) => {
                    if (err) {
                        throw new Error(err.message)
                    }
                    res.writeHead(200, 'Success', { 'Content-Type': 'text/html' }, { Location: "/home" })
                    res.write(data)
                    res.end()
                })
            } else {
                postModel.createPost(req, res)
            }
            break;
        case '/update':
            const urlPath = url.parse(req.url, true);
            let queryString = urlPath.query;
            let id = Number(queryString.id);
            if (req.method === 'GET') {

                fs.readFile('./views/update.html', 'utf-8', (err, data) => {
                    if (err)
                        throw new Error(err.message)
                    data = data.replace('{id}', id)
                    res.writeHead(200, 'Success', { 'Content-Type': 'text/html' }, { Location: '/home' })
                    res.write(data);
                    res.end()
                })
            } else {
                postModel.updatePost(req, res, id)
            }
            break;
        case '/delete':
            if (req.method === 'GET') {
                postModel.deletePosts(req, res);
            }
            break
    }



})



server.listen(8000, () => {
    console.log('Server is running in port 8000')
})