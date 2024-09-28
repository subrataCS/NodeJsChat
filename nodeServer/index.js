const io = require('socket.io')(5000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
    },
});

const users = {};

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('new-user-joined', name => {
        console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
});
