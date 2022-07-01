const mysql = require('mysql');
const http = require('http');
const qs = require('qs');
const url = require('url')
const fs = require('fs');
const util = require('util');
const Database = require('./model/Database');

let database = new Database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'shopping_web',
    charset: 'utf8_general_ci',
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});
const query = util.promisify(connection.query).bind(connection);

database.connection(function(err) {
    if (err) {
        console.log(err);;
    } else {
        console.log('DB Connection Success')
    }
})

const server = http.createServer(async(req, res) => {
    console.log(req.url);
    let parseUrl = url.parse(req.url);
    let path = parseUrl.pathname;

    switch (path) {
        case '/':
            if (req.method === 'GET') {
                fs.readFile('./views/login.html', 'utf-8', (err, data) => {
                    if (err)
                        throw new Error(err.message);
                    res.write(data);
                    res.end();
                })

            }
            break;
        case '/register':
            if (req.method === 'GET') {
                fs.readFile('./views/register.html', 'utf-8', (err, data) => {
                    if (err)
                        throw new Error(err.message)
                    res.write(data);
                    res.end()
                })
            }
            break;
        case '/home':
            if (req.method === "GET") {
                await showListPosts(req, res);
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
                createPost(req, res)
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
                updatePost(req, res, id)
            }
            break;
        case '/delete':
            if (req.method === 'GET') {
                deletePosts(req, res);
            }
            break
    }



})


async function showListPosts(req, res) {
    let result;
    let sql = 'SELECT * FROM posts';
    try {
        result = await query(sql);
    } catch (err) {
        console.log(err);
    }
    fs.readFile('./views/index.html', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let html = ''
            result.forEach(items => {

                html += '<tr>'
                html += `<td>${items.id}</td>`
                html += `<td>${items.title}</td>`
                html += `<td>${items.content}</td>`
                html += `<td>${items.userId}</td>`
                html += `<td>${items.image}</td>`
                html += `<td>${items.statusId}</td>`
                html += `<td>${items.price}</td>`
                html += `<td>${items.quantity}</td>`
                html += `<td><a onclick="confirm('Are you sure ?')" href="/delete?id=${items.id}">Delete</a></td>`
                html += `<td><a href="/update?id=${items.id}">Update</a></td>`
                html += '</tr>'
            })
            data = data.replace('{list}', html)
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        }

    })
}

function createPost(req, res) {
    let data = ''
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', () => {
        const posts = qs.parse(data);
        const sqlCreate = `INSERT INTO posts(title, content,userId,image,statusId,price,quantity) VALUES ('${posts.title}', '${posts.content}',${posts.userId},'${posts.image}',${posts.statusId},${posts.price},${posts.quantity})`;
        connection.query(sqlCreate, (err, results) => {
            if (err) throw err;
            res.writeHead(301, {
                Location: "/home"
            })
            res.end();
        });
    })
}

function updatePost(req, res) {
    let data = '';
    req.on('data', chunk => {
        data += chunk
    })
    req.on('end', () => {
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let id = Number(queryString.id);
        const post = qs.parse(data);
        const sqlUpdate = `
                UPDATE posts SET title = '${post.title}', content = '${post.content}', userId = ${post.userId}, image = '${post.image}', statusId = ${post.statusId}, price = ${post.price}, quantity = ${post.quantity}
                WHERE id = ${id}`
        console.log(sqlUpdate);
        connection.query(sqlUpdate, (err, result) => {
            if (err)
                throw new Error(err.message)
            res.writeHead(301, { 'Content-Type': 'text/html' }, { Location: '/home' })
            res.write(data);
            res.end();
        })
    })
}

function deletePosts(req, res) {
    const urlPath = url.parse(req.url, true);
    let queryString = urlPath.query;
    let id = Number(queryString.id);
    const deleteQuery = `
                DELETE FROM posts WHERE id = ${id}
                `
    connection.query(deleteQuery, (err, result) => {
        if (err)
            throw new Error(err.message)

    })
    res.writeHead(301, 'Success', { Location: '/home' })
    res.end()
}

server.listen(8000, () => {
    console.log('Server is running in port 8000')
})