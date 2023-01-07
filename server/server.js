const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
const server = require('http').Server(app);
const cors = require('cors');
const chroma = require('./chroma.min.js');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
const PORT = 3001;

const rooms = new Map();
app.use(cors());
app.get('/', function (req, res) {
  console.log('Hello from slash');
  res.send('Hello from Node Main');
});
app.get('/color', function (req, res) {
  const backgroundColor = chroma.random().toString();
  const textColor =
    chroma(backgroundColor).luminance() > 0.5 ? '#000' : '#fff';
  res.json({ backgroundColor, textColor });
});
app.get('/rooms/:id', (req, res) => {
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
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  res.json(rooms);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, user }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, user);
    const usersInRoom = [...rooms.get(roomId).get('users').values()];
    socket.broadcast.to(roomId).emit('ROOM:SET_USERS', usersInRoom);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, user, text }) => {
    const obj = {
      user,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const usersInRoom = [...value.get('users').values()];
        socket.broadcast.to(roomId).emit('ROOM:SET_USERS', usersInRoom);
      }
    });
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Server started on port ' + PORT);
});

