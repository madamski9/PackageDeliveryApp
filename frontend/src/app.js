const socket = new WebSocket("ws://localhost:3000")

// zdarzenia po sukcesywnym handshake
socket.onopen = () => {
    console.log("Polaczenie WebSocket zostalo otwarte")
    socket.send("Wiadomosc do serwera")
}

socket.onmessage = (event) => {
    console.log("Wiadomosc od serwera: ", event.data)
}

// errory
socket.onerror = (error) => {
    console.log('Wystapil blad:', error);
};

// po zamknieciu
socket.onclose = () => {
    console.log('Polaczenie zostalo zamkniete');
};

