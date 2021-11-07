// The primary socket processing on server side
const io = require('../server').io
console.log("socketMain is on line");
io.sockets.on('connect', (socket) => {
    console.log("initial connection ");
    socket.on('score-change', (data) => {
       // console.log(data);
        try {
            const roomName = data.room;
            const scores = data.scores;
            // console.log(`broadcasting to room ${roomName}`);
            socket.to(roomName).emit(`score-change`, JSON.stringify(JSON.parse(scores)));
        } catch (error) {
            handleError(socket, error, data);
        }
    });

    socket.on('join-room', (data) => {
        try {
            socket.rooms.forEach((room) => {
                socket.leave(room);
            });
            socket.join(data);
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
});

function handleError(socket, error, data) {
    try {
        console.log(`ERROR: ${error} - DATA: ${JSON.stringify(data)} - STACK: ${error.stack}`);
        console.error(error);
        let errorMessage = `A stupid error happened in processing. Not something we expected. If the server didn't go down, you may want to just start over. Sorry!`
        if (socket) {
            socket.emit('backendError', errorMessage);
        }
    } catch (e) {W
        // dont' shut down if error handling error
        console.log(e);
    }
}

module.exports = io;