if(process.env.NODE_ENV !== 'production') require('dotenv').config()
const http = require('http');
const WebSocketServer = require('websocket').server;
let jwt = require('jsonwebtoken');

const httpServer = http.createServer(async (req, res) => {
    if(req.method === 'OPTIONS') {
        const optionsHeaders = {
            "Access-Control-Allow-Origin":"*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Max-Age": 2592000,
            "Access-Control-Allow-Headers": "Content-Type",
        };
        res.writeHead(204, optionsHeaders)
        res.end()
        return;
    }

    if(req.url == '/login' && req.method == 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data+= chunk;
        })
        req.on('end', async () => {
        let userObj = JSON.parse(data);
        const token = await jwt.sign({ name: userObj.name }, process.env.SECRET);
        const postHeaders = {
            "Access-Control-Allow-Origin":"*",
            'Content-Type':"application/json"
        };
        res.writeHead(200,postHeaders);
        newUserConnection = userObj.name;
        res.end(JSON.stringify({name:userObj.name, token:token}));
        })
    } else {
        res.writeHead(400, {
            'Content-Type':'application/json'
        })
        res.end(JSON.stringify({"error":"error Russell"}))
    }
});

let ws = new WebSocketServer({
    "httpServer":httpServer
});

let newUserConnection = '';

ws.on('request', (r) => {
    let connectionsArray = ws.connections;
    console.log('new request received');
    let connection = r.accept(null, r.origin);
    connectionsArray.forEach((connection) => {
        connection.send(`user ${newUserConnection} has entered the chat`);
    })
    connection.on('open', (c) => {
         console.log('open connection:', c)
         console.log('we are here');

    })

    connection.on('close', () => {
        console.log('connection closed');
    })
    connection.on('message', (m) => {
        console.log(`message received from client: ${m.utf8Data}`);
            connectionsArray.forEach((connection) => {
            connection.send(`${m.utf8Data}`)
        })
    })
})

let PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});




