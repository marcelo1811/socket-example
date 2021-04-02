const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Olá');
});

io.on('connection', (socket) => {
  console.log('+ a user connected');
  socket.on('chat', (data) => {
    io.emit('chat', data)
  });

  socket.on('disconnect', () => {
    console.log('- a user disconnected')
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});