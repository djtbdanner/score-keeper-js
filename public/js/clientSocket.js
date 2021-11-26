let socket = io.connect(window.location.href);

socket.on('score-change', (data) => {
    const scoreData = JSON.parse(data.scores);
    drawScreen(JSON.parse(scoreData), false, data.roomName );
});

function scoreChange(room, scores, isOwner) {
    socket.emit(`score-change`, { room, scores: JSON.stringify(scores), isOwner:isOwner });
}

socket.on('room-change', () => {
    processRoomAdded();
});

socket.on('message-room', (message) => {
    alert(message);
});

function sendRoomMessage(roomName, message) {
    socket.emit(`message-room`, { roomName, message });
}

async function getAvailableRooms() {
    const result = await asyncEmit('get-rooms');
    return  JSON.parse(result);
}

async function getAvailableRooms() {
    const result = await asyncEmit('get-rooms');
    return  JSON.parse(result);
}

socket.on(`backendError`, (data) => {
    alert(data);
});

async function joinRoom(roomName) {
    const result = await asyncEmit(`join-room`, roomName);
    const scores = JSON.parse(result);
    drawScreen(scores, false, roomName);
}

async function isRoomAvailable(room) {
    const result = await asyncEmit('is-room-available', room);
    const isAvailable = result.isAvailable;
    console.log('result ' + JSON.stringify(isAvailable));
    return isAvailable;
}

function asyncEmit(eventName, data) {
    return new Promise(function (resolve, reject) {
        socket.emit(eventName, data);
        socket.on(eventName, result => {
            socket.off(eventName);
            resolve(result);
        });
        setTimeout(reject, 1000);
    });
}

function disconnect() {
    socket.disconnect();
}

function reconnect() {
    socket.connect();
}