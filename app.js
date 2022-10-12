const http = require('http');
const WebSocketServer = require('websocket').server;
let connection;
httpServer = http.createServer((req, res) => {
    console.log('request received');
})

let ws = new WebSocketServer({
    "httpServer":httpServer
});

let PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

ws.on('request', (r) => {
    connection = r.accept();
    connection.on('open', (e) => {
        console.log(`connection opened`)
    })
    connection.on('close', (e) => {
        console.log('connection closed');
    })
    connection.on('message', (m) => {
        console.log(`message received from client: ${m.utf8Data}`);
        let connectionsArray = ws.connections;
        connectionsArray.forEach((connection) => {
            connection.send(`message from user: ${m.utf8Data}`)
        })
    })
})