//Load in the modules
const http = require('http');
const fs = require('fs');
const WebSocketServer = require('websocket').server;

//Create a http server
const server = http.createServer()
server.listen(80);

//wrap the http server with the web socket server
const wsServer = new WebSocketServer({
    httpServer: server
});

//I think request is a keyword
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
      console.log('Received Message:', message.utf8Data);
      connection.sendUTF('Hi this is WebSocket server!');
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});
