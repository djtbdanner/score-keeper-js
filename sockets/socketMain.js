// The primary socket processing on server side
const io = require('../server').io
const Room = require('./classes/Room');

// rooms database :)
let rooms = new Map();

io.sockets.on('connect', (socket) => {
    console.log("initial connection ");
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
            socket.emit(`score-change`, JSON.stringify(JSON.parse(room.scores)));
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