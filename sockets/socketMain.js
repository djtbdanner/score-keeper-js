// The primary socket processing on server side
const io = require('../server').io
const Room = require('./classes/room');

// rooms database :)
let rooms = new Map();

io.sockets.on('connect', (socket) => {
    console.log("initial connection ");
    /// TODO -- don't do this mmm - K
    //  let room = new Room(`dave`);
    //  room.scores = `[{"teamName":"Dave","score":"0","color":"#ff0000","textColor":"#888888"},{"teamName":"Snakes","score":"0","color":"#00ff00","textColor":"#123456"},{"teamName":"Hawks","score":"0","color":"#0000ff","textColor":"#ffff00"},{"teamName":"Tired","score":"0","color":"#ff00ff","textColor":"#00ff00"},{"teamName":"Happy","score":"0","color":"#ffffff","textColor":"#000000"},{"teamName":"Tater","score":"0","color":"#ff5555","textColor":"#882288"},{"teamName":"Foofs","score":"0","color":"#ff0000","textColor":"#000000"},{"teamName":"Team","score":"0","color":"#777777","textColor":"#110022"}]`;
    //  rooms.set('dave', room);
    // room = new Room(`jill`);
    // room.scores = `[{"teamName":"Dave","score":"0","color":"#ff0000","textColor":"#888888"},{"teamName":"Don","score":"10","color":"#ff00ff","textColor":"#000000"}]`;
    // rooms.set('jill', room);
    // this just a test

    socket.on('score-change', (data) => {
        try {
            const roomName = data.room;
            const scores = data.scores;
            let room = rooms.get(roomName);
            if (!room){
                room = new Room(roomName);
            }
            room.scores = scores;
            rooms.set(roomName, room);
            console.log(`broadcasting to room ${roomName}, scores ${JSON.stringify(scores)}`);
            socket.to(roomName).emit(`score-change`, JSON.stringify(JSON.parse(scores)));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('join-room', (data) => {
        try {
            socket.rooms.forEach((userRoom) => {
                socket.leave(userRoom);
            });
            room = rooms.get(data);
            if (!room){
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
            console.log(`checking if ${data} is available ${room===undefined}`);
            socket.emit('is-room-available', {isAvailable:room===undefined});
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
    console.log(`socket ${id} has left room ${room}`);
});
io.of("/").adapter.on("delete-room", (room) => {
    console.log(`room ${room} was deleted`);
    rooms.delete(room);
});

function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error [${error.message}] happened in processing. Not something we expected. If the server didn't go down, you may want to just start over. Sorry!`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {
        // dont' shut down if error handling error
        console.log(e);
    }
}

module.exports = io;