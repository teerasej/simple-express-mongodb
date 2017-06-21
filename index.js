


let express = require('express');
let bodyParser = require('body-parser');
let monkDB = require('monk')('localhost:27017/mimo')
let app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
    req.db = monkDB;
    next();
})

app.get('/users', (req, res, next) => {
    let db = req.db;

    let users = db.get('users');

    users.find().then((docs) => {
        res.json(docs);
    })

});

app.post('/users/create', (req, res, next) => {
    console.log("Creating user...");

    console.log(req.body.username);

    let db = req.db;
    let users = db.get('users');

    // สร้าง object ของ User ใหม่
    let newUser = {
        username: req.body.username,
        Email: req.body.Email
    }

    // สั่ง insert ข้อมูลของ User ใหม่เข้าไปใน Collection
    users.insert(newUser).then(docs => {
        // ส่ง json ที่ฐานข้อมูลคืนค่ากลับมา ไปให้ client
        res.json(docs);
    })

})

app.put('/users', (req, res, next) => {
    let id = req.body.id;
    let newUsername = req.body.username;

    req.db.get('users').update(
        { _id: id }
        , { username: newUsername }
        , docs => {
            res.json(docs);
        });
})

app.delete('/users', (req, res, next) => {

    let id = req.body.id;

    req.db.get('users').remove(
        { _id: id }
        , docs => { 
            res.json(docs) 
        });

})


app.listen(3000);