const mysql = require('mysql');
const http = require('http');
const qs = require('qs');
const url = require('url')
const fs = require('fs');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'shopping_web',
    charset: 'utf8_general_ci',
    // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});
const query = util.promisify(connection.query).bind(connection);

connection.connect(function(err) {
    if (err) {
        console.log(err);;
    } else {
        console.log('DB Connection Success')
    }
})

const server = http.createServer(async(res, req) => {
    let pathUrl = url.parse(req.url).pathname;
    switch (pathUrl) {
        case '/':
            if (req.method === "GET") {
                await showListPosts(req, res);
            }
            break;

    }

})
async function showListPosts() {
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
                html += `<td><a href="/delete1?id=${items.id}">delete</a></td>`
                html += `<td><a href="/update?id=${items.id}">update</a></td>`
                html += '</tr>'
            })
        }


    })
}
server.listen(8000, () => {
    console.log('Server is running in port 8000')
})