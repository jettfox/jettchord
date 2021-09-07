const express = require('express');
const app = express();
const listener = require('./listen')
let socket = require('./socket')


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