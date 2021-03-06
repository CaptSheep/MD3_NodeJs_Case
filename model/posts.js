const util = require('util');
const qs = require('qs');
const fs = require('fs');
const Database = require('./Database');
const url = require('url')

module.exports = class PostModel {
    constructor() {
        let db = new Database
        this.conn = db.connection();

    }
    async showListPosts(req, res) {
        const query = util.promisify(this.conn.query).bind(this.conn)
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
                    html += `<td><a href="/info?id=${items.id}">Info</a></td>`
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

    createPost(req, res) {
        let data = ''
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            const posts = qs.parse(data);
            const sqlCreate = `INSERT INTO posts(title, content,userId,image,statusId,price,quantity) VALUES ('${posts.title}', '${posts.content}',${posts.userId},'${posts.image}',${posts.statusId},${posts.price},${posts.quantity})`;
            this.conn.query(sqlCreate, (err, results) => {
                if (err) throw err;
                res.writeHead(301, {
                    Location: "/home"
                })
                res.end();
            });
        })
    }

    updatePost(req, res) {

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
            this.conn.query(sqlUpdate, (err, result) => {
                if (err)
                    throw new Error(err.message)
                res.writeHead(301, { 'Content-Type': 'text/html' }, { Location: '/home' })
                res.write(data);
                res.end();
            })
        })
    }

    deletePosts(req, res) {

        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let id = Number(queryString.id);
        const deleteQuery = `
                DELETE FROM posts WHERE id = ${id}
                `
        this.conn.query(deleteQuery, (err, result) => {
            if (err)
                throw new Error(err.message)

        })
        res.writeHead(301, 'Success', { Location: '/home' })
        res.end()
    }
    postInfo(req,res){
        const urlPath = url.parse(req.url, true);
        let queryString = urlPath.query;
        let id = Number(queryString.id);
        const infoQuery = `SELECT * FROM posts WHERE id = ${id}`
        this.conn.query(infoQuery,(err,result)=>{
            if(err){
                throw new Error(err.message)
            }
              else{
                 fs.readFile('./views/info.html','utf-8',(err,data)=>{
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
                         html += '</tr>'
                         html += `<a href="/home">Back</a>`
                     })
                     data = data.replace('{list}', html)
                     res.writeHead(200, { 'Content-Type': 'text/html' });
                     res.write(data);
                     return res.end();
                 })
            }

        })
    }

}