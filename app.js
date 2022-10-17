if(process.env.NODE_ENV !== 'production') require('dotenv').config()
const http = require('http');
const WebSocketServer = require('websocket').server;
let jwt = require('jsonwebtoken');
let connection;



httpServer = http.createServer(async (req, res) => {
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
        res.end(JSON.stringify({name:userObj.name, token:token}));
        })
    } else {
        res.writeHead(400, {
            'Content-Type':'application/json'
        })
        res.end(JSON.stringify({"error":"error Russell"}))
    }

    
    // let ws = new WebSocketServer({
    //     "httpServer":httpServer
    // });

    // ws.on('request', (r) => {
    //     console.log('new request received');
    //     connection = r.accept(null, r.origin);
        
    //     connection.on('open', () => {
    //         console.log(`connection opened`) 
    //     })
    //     connection.on('close', () => {
    //         console.log('connection closed');
    //     })
    //     connection.on('message', (m) => {
    //         console.log(`message received from client: ${m.utf8Data}`);
    //         let connectionsArray = ws.connections;
    //         connectionsArray.forEach((connection) => {
    //             connection.send(`message from user: ${m.utf8Data}`)
    //         })
    //     })
    // })
});

let PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

