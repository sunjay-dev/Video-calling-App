const socketIo = require('socket.io');
const { nanoid } = require('nanoid');
const redis = require('./config/redis.config.js');
let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: true
  });

  io.on('connection', (socket) => {
    socket.on('create-room', async () => {
      const roomId = nanoid(10).toLowerCase();
      socket.join(roomId);

      await redis.hset('socket', socket.id, roomId);
      socket.emit('get-room-id', roomId);
    });

    socket.on('join-room', async (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) {
        socket.emit('room-not-exists');
        return;
      }
      if (room.size >= 2) {
        socket.emit('room-full');
        return;
      }
      socket.join(roomId);
      socket.emit('room-exists', roomId);

      await redis.hset('socket', socket.id, roomId);

      socket.to(roomId).emit('user-joined');
    });

    socket.on('send-offer', async (offer) => {
      const roomId = await redis.hget('socket', socket.id);
      socket.to(roomId).emit('accept-offer', offer);
    });

    socket.on('offer-accepted', async (ans) => {
      const roomId = await redis.hget('socket', socket.id);
      socket.to(roomId).emit('offer-accepted', ans);
    });
    socket.on('nego-needed', async (offer) => {
      const roomId = await redis.hget('socket', socket.id);
      socket.to(roomId).emit('nego-needed', offer);
    });
    socket.on('nego-done', async (ans) => {
      const roomId = await redis.hget('socket', socket.id);
      socket.to(roomId).emit('nego-done', ans);
    });
    socket.on('call-end', async () => {
      const roomId = await redis.hget('socket', socket.id);
      socket.to(roomId).emit('call-end');
      socket.leave(roomId);
      await redis.hdel('socket', socket.id);
    });

    socket.on('disconnect', async () => {
      console.log(socket.id, " disconnected");
      const roomId = await redis.hget('socket', socket.id);
      if (!roomId) return;

      socket.to(roomId).emit('call-end');
      socket.leave(roomId);
      await redis.hdel('socket', socket.id);
    });
  });
}

const getIoInstance = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
module.exports = { initializeSocket, getIoInstance };