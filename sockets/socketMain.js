// The primary socket processing on server side
const io = require('../server').io
const Room = require('./classes/room');
const Timer = require('./classes/timer');
// rooms database :)
let rooms = new Map();

async function broadcastTimer(room, socket, includeMe) {
    const total = room.timer.totalSeconds;
    const current = room.timer.currentSeconds;
    let displaySeconds = room.timer.totalSeconds - room.timer.currentSeconds;

    const obj = {};
    obj.display = secondsToDisplay(displaySeconds);
    obj.percentComplete = `${parseInt(current / total * 100, 10)}`;
    // everyone else
    socket.broadcast.to(room.name).emit(`timer-change`, obj);

    if (includeMe){
        if (room.timer.totalSeconds <= room.timer.currentSeconds){
            obj.display = secondsToDisplay(room.timer.totalSeconds) + `\u25BA` ;
        }
        // owner
        socket.emit(`timer-change`, obj);
    }
}

function secondsToDisplay(displaySeconds){
    let minutes = 0;
    let seconds = displaySeconds;
    if(displaySeconds > 60){
        minutes = Math.floor(displaySeconds/60);
        seconds = displaySeconds%60;
    }
    minutes = String(minutes).padStart(2,`0`);
    seconds = String(seconds).padStart(2,`0`);
    return `${minutes}:${seconds} `;
}

async function startTimer(room, socket) {
    if (!room || !room.timer) {
        throw Error(`No room or no timer in room to process timer functionality`);
    }
    while (room.timer.currentSeconds <= room.timer.totalSeconds) {
        broadcastTimer(room, socket, true);
        room.timer.currentSeconds = room.timer.currentSeconds + 1;
        await delay(1000);
    }
    room.timer.currentSeconds = room.timer.totalSeconds;
    // everyone else
    socket.broadcast.to(room.name).emit(`play-sound`);
    socket.emit(`play-sound`);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}


io.sockets.on('connect', (socket) => {
    console.log("initial connection ");
    //// TODO -- don't do this mmm - K
    // let room = new Room(`8`);
    //  room.scores = `[{"teamName":"Dave","score":"880","color":"#ff0000","textColor":"#888888"},{"teamName":"Snakes","score":"100","color":"#00ff00","textColor":"#123456"},{"teamName":"Hawks","score":"0","color":"#0000ff","textColor":"#ffff00"},{"teamName":"Tired","score":"0","color":"#ff00ff","textColor":"#00ff00"},{"teamName":"Happy","score":"0","color":"#ffffff","textColor":"#000000"},{"teamName":"Tater","score":"0","color":"#ff5555","textColor":"#882288"},{"teamName":"Foofs","score":"0","color":"#ff0000","textColor":"#000000"},{"teamName":"Team","score":"0","color":"#777777","textColor":"#110022"}]`;
    //  rooms.set('8', room);
    // room = new Room(`2`);
    // room.scores = `[{"teamName":"Dave","score":"99","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"}]`;
    // rooms.set('2', room);
    // room = new Room(`3`);
    // room.scores = `[{"teamName":"Dave","score":"99","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"},{"teamName":"Elephant","score":"100","color":"red","textColor":"green"}]`;
    // rooms.set('3', room);
    // room = new Room(`4`);
    // room.scores = `[{"teamName":"Dave","score":"987878","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"},{"teamName":"Don","score":"920","color":"green","textColor":"red"},{"teamName":"Elephant","score":"100","color":"red","textColor":"green"}]`;
    // rooms.set('4', room);
    // room = new Room(`5`);
    // room.scores = `[{"teamName":"Dave","score":"123456","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"},{"teamName":"Don","score":"920","color":"green","textColor":"red"},{"teamName":"Elephant","score":"100","color":"red","textColor":"green"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"}]`;
    // rooms.set('5', room);
    // room = new Room(`6`);
    // room.scores = `[{"teamName":"Dave","score":"99","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"},{"teamName":"Don","score":"920","color":"green","textColor":"red"},{"teamName":"Elephant","score":"100","color":"red","textColor":"green"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"}]`;
    // rooms.set('6', room);
    // room = new Room(`7`);
    // room.scores = `[{"teamName":"Dave","score":"99","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"},{"teamName":"Don","score":"920","color":"green","textColor":"red"},{"teamName":"Elephant","score":"100","color":"red","textColor":"green"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"},    {"teamName":"Dave","score":"999","color":"#ff0000","textColor":"#888888"}]`;
    // rooms.set('7', room);
    //// this just a test

    socket.on('score-change', (data) => {
        try {
            const roomName = data.room;
            const scores = data.scores;
            const isOwner = data.isOwner;
            let room = rooms.get(roomName);
            const timeSettings = data.timeSettings;
            if (!room) {
                room = new Room(roomName);
                socket.broadcast.emit('room-change');
                if (timeSettings.seconds){
                    const seconds = parseInt(timeSettings.seconds, 10);
                    const timer = new Timer(seconds, seconds, true);
                    room.timer = timer;
                    broadcastTimer(room, socket, true); 
                }
            }
            room.scores = scores;
            if (isOwner) {
                room.owner = socket.id;
                socket.join(roomName);
            }
            rooms.set(roomName, room);
            const hasTimer = !!room.timer
            socket.broadcast.to(roomName).emit(`score-change`, { scores, roomName, hasTimer});
            if (room.timer){
                // --todo-- can we just send this with the score???
                broadcastTimer(room, socket, false); 
            }
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('join-room-by-name', (data) => {
        try {
            room = rooms.get(data);
            if (!room) {
                throw new Error(`Could not find room or game: ${data}.`);
            }
            socket.join(data);
            const hasTimer = !!room.timer
            socket.emit(`join-room-by-name`, {scores: room.scores, hasTimer});
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('get-rooms', () => {
        try {
            socket.emit('get-rooms', JSON.stringify(Array.from(rooms.keys())));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('is-room-available', (data) => {
        try {
            const room = rooms.get(data);
            console.log(`checking if ${data} is available ${room === undefined}`);
            socket.emit('is-room-available', { isAvailable: room === undefined });
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('start-timer', async (data) => {
        try {
            const room = rooms.get(data.roomName);
            if (parseInt(room.timer.currentSeconds, 10) < parseInt(room.timer.totalSeconds,10)) {
                socket.emit('message-room', 'Wait until timer completes before restarting it.');
                return;
            }
            if (parseInt(room.timer.currentSeconds,10) >= parseInt(room.timer.totalSeconds,10)) {
                room.timer.currentSeconds = 0;
                startTimer(room, socket);
            }

        } catch (error) {
            handleError(socket, error, data);
        }
    });


    socket.on('get-text-messages', (data) => {
        try {
            const room = rooms.get(data);
            console.log(`getting messages`);
            socket.emit('get-text-messages', room.textMessages);
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('message-text', (data) => {
        try {
            const roomName = data.roomName;
            const message = data.message;
            const room = rooms.get(roomName);
            room.textMessages.push(message);
            socket.broadcast.to(roomName).emit(`new-text-message`);
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('message-room', (data) => {
        try {
            const roomName = data.roomName;
            const message = data.message;
            console.log(`sending message to room  ${roomName} message ${message}`);
            const room = rooms.get(roomName);
            if (room) {
                room.textMessages.push(`&#9733 ${message}`);
            }
            socket.to(roomName).emit('message-room', message);
        } catch (error) {
            handleError(socket, error, data);
        }
    });
});

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
io.of("/").adapter.on("leave-room", (room, id) => {
    let socket;
    try {
        socket = io.sockets.sockets.get(id);
        const abandonRoom = rooms.get(room);
        if (abandonRoom && abandonRoom.owner === id) {
            const msg = `The scorekeeper left or lost Internet connection. If game ${room} is still on, they may reconnect and you will still catch the score.`;
            abandonRoom.textMessages.push(`&#9733; ${msg}`);
            socket.to(room).emit('message-room', msg);
        }
        console.log(`socket ${id} has left room ${room}`);
    } catch (error) {
        handleError(socket, error, "leaving room");
    }
});
io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    if (rooms.get(room)) {
        rooms.delete(room);
        io.sockets.emit('room-change');
    }
    rooms.delete(room);
});

function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error [${error.message}]. Not something we expected. If the server didn't go down, you may want to just start over. Sorry!`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {
        // dont' shut down if error handling error
        console.log(e);
    }
}


module.exports = io;