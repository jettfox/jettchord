const express = require('express');
const app = express();
const listener = require('./listen')
let socket = require('./socket')
var cors = require('cors');

app.use(cors()); 
app.use(express.static(__dirname + '..dist/jettchord'));


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const http = require('http');
const server = http.Server(app);


const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;
listener.listen(server, port);
socket.connect(io, port)




app.post('/api/auth', function(req,res){ 
    let users = [
        {
            "username": "jett",
            "password": "1234",
            "email": "jett@email.com",
            "id": "1"
        },
        {
            "username": "john",
            "password": "1234",
            "email": "john@email.com",
            "id": "2"
        },
        {
            "username": "jeff",
            "password": "1234",
            "email": "jeff@email.com",
            "id": "3"
        }
    ]
    if (!req.body) {
        return res.sendStatus(400)
    }
    var user = {};
    user.username = "";
    user.password = "";
    user.email = "";
    user.valid = false;
    
    for (let i=0; i<users.length;i++){
        
        if (req.body.email == users[i].email && req.body.password == users[i].password){
            
            user.username = users[i].username;
            user.email = users[i].email;
            user.password = users[i].password;
            user.valid = true;
        }
    }
    if (user.valid == true){
        res.send(user);
    }
    
});
