const express = require('express');
const bcrypt = require('bcrypt');

const app = express()
app.use(express.json());
const users = [];
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => {
        res.render('index.html')
    })
    // app.post('/users', async(req, res) => {
    //     try {
    //         const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //         const user = { name: req.body.name, password: hashedPassword }
    //         users.push(user)
    //         res.status(201);
    //         res.send();
    //     } catch {
    //         res.send(500)
    //         res.send()
    //     }
    // })
    // app.post('/login', async(req, res) => {
    //     const user = users.find(user => user.name === req.body.name);
    //     if (user == null) {

//         return res.status(400).send('Cannot find User')
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, user.password)) {
//             res.send('Success')
//         } else {
//             res.send('Wrong')
//         };
//     } catch {
//         res.status(500).send()
//     }
// })
app.listen(8000)