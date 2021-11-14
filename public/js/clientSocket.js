let socket = io.connect(window.location.href);

socket.on('score-change', (data) => {
    const scores = JSON.parse(data);
    console.log(scores);
    drawScreen(scores);
});

function scoreChange(room, scores) {
    socket.emit(`score-change`, { room, scores: JSON.stringify(scores) });
}

function getAvailableRooms() {
    socket.emit(`get-rooms`);
}

socket.on('get-rooms', (data) => {
    const availableRooms = JSON.parse(data);
    buildRoomList(availableRooms);
});

socket.on(`backendError`, (data) => {
    alert(data);
});

function joinRoom(roomName) {
    socket.emit(`join-room`, roomName);
}

function disconnect() {
    socket.disconnect();
}

function reconnect() {
    socket.connect();
}