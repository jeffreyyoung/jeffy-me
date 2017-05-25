const socketio = require('socket.io');

function SocketHandler(server) {
  this.server = server;
  this.io = socketio(server);
  this.io.on('connection', (socket) => {
    socket.on('drawing', data => {
      socket.broadcast.emit('drawing', data)
    });
  })
}

module.exports = SocketHandler
