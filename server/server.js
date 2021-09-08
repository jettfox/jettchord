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

class User {
    constructor(username, birthdate, age, email, password, valid) {
        this.username = username
        this.birthdate = birthdate
        this.age = age
        this.email = email
        this.password = password
        this.valid = valid
    }
}



app.post('/api/auth', function(req,res){ 
    let users = [new User("jett", "31/01/2000", 21, "jett@email.com", "1234", true), new User("callum", "05/05/1900", 121, "callum@email.com", "1234", true), new User("ryan", "12/12/1921", 100, "ryan@email.com", "1234", true)]
    if (!req.body) {
        return res.sendStatus(400)
    }
    var user = {};
    user.name = "";
    user.birthdate = "";
    user.age = 0;
    user.email = "";
    user.password = "";
    user.valid = false;
    
    for (let i=0; i<users.length;i++){
        if (req.body.email == users[i].email && req.body.upwd == users[i].pwd){
            user.name = users[i].name;
            user.birthdate = users[i].birthdate;
            user.age = users[i].age;
            user.email = users[i].email;
            user.password = users[i].password;
            user.valid = users[i].valid;
        }
    }
    if (user.valid == true){
        res.send(user);
    }
    
});
