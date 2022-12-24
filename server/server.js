const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
const server = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const PORT = 3001;

const rooms = new Map();

app.get('/', function (req, res) {
  console.log('Hello from slash');
  res.send('Hello from Node Main');
});

app.get('/rooms/:id', (req, res) => {
  // console.log('Hello from Node JS');
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post('/socket.io/*', (req, res) => {
  res.send();
});

app.post('/rooms', (req, res) => {
  const { roomId, user } = req.body;
  // console.log("----------"+userName);
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  // console.log(rooms);
  res.json(rooms);
  // console.log('Hello from Node JS rooms POST');
  // console.log(req.body);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, user }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, user);
    const usersInRoom = [...rooms.get(roomId).get('users').values()];
    // console.log(usersInRoom);
    socket.broadcast.to(roomId).emit('ROOM:SET_USERS', usersInRoom);
    // console.log(data);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, user, text }) => {
    const obj = {
      user,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
    // console.log('--------------st------------------');
    // console.log(obj);
    // console.log('--------------fin-----------------');
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const usersInRoom = [...value.get('users').values()];
        socket.broadcast.to(roomId).emit('ROOM:SET_USERS', usersInRoom);
      }
    });
  });
  // console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Server started on port ' + PORT);
});

// console.log(`${__dirname}+$`);
// console.log(fs);
