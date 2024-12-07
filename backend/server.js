const WebSocket = require('ws');
const http = require('http');

// serwer http do innych celow
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('HTTP Server for WebSocket');
});

// websocket server
const wss = new WebSocket.Server({ server });

// handshake
wss.on("connection", function connection(ws) {
    console.log("Nowe polaczenie WebSocket")

    ws.send("Witaj")

    ws.on("message", function incoming(message) {
        if (Buffer.isBuffer(message)) { // jesli wiadomosc jest w wersji binarnej to zmieniamy na utf-8
            message = message.toString('utf-8')
        }
        console.log("Wiadomosc od klienta: ", message)
        ws.send("Odpowiedz od serwera")
    })
})

// nasluchiwanie server
server.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});