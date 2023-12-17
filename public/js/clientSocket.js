let socket = io.connect(window.location.href);

socket.on('score-change', (data) => {
    const scoreData = data.scores;
    const hasTimer = data.hasTimer;
    drawScreen(scoreData, false, data.roomName, hasTimer);
});

function scoreChange(room, scores, isOwner, totalSeconds) {
    socket.emit(`score-change`, { room, scores, isOwner, totalSeconds });
}

socket.on('room-change', () => {
    processRoomAdded();
});

socket.on('message-room', (message) => {
    modalMessage(message);
});

function sendRoomMessage(roomName, message) {
    socket.emit(`message-room`, { roomName, message });
}

async function getAvailableRooms() {
    const result = await asyncEmit('get-rooms');
    return JSON.parse(result);
}

socket.on(`backendError`, (data) => {
    alert(data);
});

async function joinRoom(roomName) {
    try {
        const result = await asyncEmit(`join-room-by-name`, roomName);
        const scores = result.scores;
        const hasTimer = result.hasTimer;
        drawScreen(scores, false, roomName, hasTimer);
    }
    catch (e) {
        handleError(e);
    }
}

async function isRoomAvailable(room) {
    const result = await asyncEmit('is-room-available', room);
    const isAvailable = result.isAvailable;
    return isAvailable;
}

socket.on('new-text-message', () => {
    textMessages();
});

socket.on('timer-change', (data) => {
    processTimer(data.display, data.percentComplete);
});

async function getMessages(room) {
    const result = await asyncEmit('get-text-messages', room);
    return result;
}

function sendTextMessage(roomName, message) {
    socket.emit(`message-text`, { roomName, message });
}

function startTimer(roomName) {
    socket.emit(`start-timer`, { roomName });
}

function timerChange(roomName, useTimer, totalSeconds) {
    socket.emit(`timer-update`, { roomName, useTimer, totalSeconds });
}


socket.on('play-sound', (data) => {
    beeper_emergency_call.play();
});

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

function handleError(e) {
    alert("There was an unexpected error in processing.");
    console.log(e);
}