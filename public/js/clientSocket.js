let socket = io.connect(window.location.href);

socket.on('score-change', (data) => {
    const scores = JSON.parse(data);
    drawScreen(scores);
});

function scoreChange(room, scores) {
    socket.emit(`score-change`, { room, scores:JSON.stringify(scores) });
}

function joinRoom(roomName) {
    socket.emit(`join-room`, roomName);
}

function disconnect() {
    socket.disconnect();
}

function reconnect() {
    socket.connect();
}