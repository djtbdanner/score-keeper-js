let socket = io.connect(window.location.href);

socket.on('score-change', (data) => {
    const scores = JSON.parse(data);
    // console.log(scores);
    drawScreen(scores);
});

function scoreChange(room, scores) {
    socket.emit(`score-change`, { room, scores: JSON.stringify(scores) });
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
    drawScreen(scores, false);
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