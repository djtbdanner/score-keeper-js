// The primary socket processing on server side
const io = require('../server').io
const Room = require('./classes/room');

// rooms database :)
let rooms = new Map();

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
            if (!room) {
                room = new Room(roomName);
                socket.broadcast.emit('room-change');
            }
            room.scores = scores;
            if (isOwner) {
                room.owner = socket.id;
                socket.join(roomName);
            }
            console.log(JSON.stringify(rooms));
            rooms.set(roomName, room);
            console.log(`broadcasting to room ${roomName}, scores: ${JSON.stringify(scores)}`);
            // socket.to(roomName).emit(`score-change`, { scores: JSON.stringify(scores), roomName });
            socket.broadcast.to(roomName).emit(`score-change`, { scores: JSON.stringify(scores), roomName });
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('join-room', (data) => {
        try {
            // socket.rooms.forEach((userRoom) => {
            //     socket.leave(userRoom);
            // });
            room = rooms.get(data);
            if (!room) {
                throw new Error(`Could not find room or game: ${data}.`);
            }
            socket.join(data);
            socket.emit(`join-room`, JSON.stringify(JSON.parse(room.scores)));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('get-rooms', () => {
        try {
            console.log(rooms);
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
            if (room){
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