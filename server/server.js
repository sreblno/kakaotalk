const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;
let users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  let addedUser = false;

  socket.on('add user', (username) => {
    if (addedUser) return;

    socket.username = username;
    users[socket.id] = username;
    ++numUsers;
    addedUser = true;
    console.log(`User added: ${username}, Total users: ${numUsers}`);

    socket.emit('login', {
      numUsers: numUsers
    });

    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

    io.emit('user list', Object.values(users));

    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;
        delete users[socket.id];
        console.log(`User disconnected: ${socket.username}, Total users: ${numUsers}`);
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });

        io.emit('user list', Object.values(users));
      }
    });
  });

  socket.on('new message', (message) => {
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: message
    });
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
