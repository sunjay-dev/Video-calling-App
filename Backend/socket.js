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
      const roomId = nanoid(10);
      socket.join(roomId);

      await redis.set(`room:${roomId}`, 'active', 'EX', 3600);
      await redis.sadd(`room:${roomId}:members`, socket.id);
      await redis.set(`socket:${socket.id}:room`, roomId);

      socket.emit('get-room-id', roomId);
    });

    socket.on('join-room', async (roomId) => {

      const exists = await redis.exists(`room:${roomId}`);

      if (!exists) {
        socket.emit('room-not-exists');
        return;
      }

      const oldRoomId = await redis.get(`socket:${socket.id}:room`);
      if (oldRoomId && oldRoomId !== roomId) {
        await redis.srem(`room:${oldRoomId}:members`, socket.id);
      }

      socket.join(roomId);

      await redis.set(`socket:${socket.id}:room`, roomId);
      await redis.sadd(`room:${roomId}:members`, socket.id);

      socket.emit('room-exists', roomId);

      socket.to(roomId).emit('user-joined');
    });

    socket.on('send-offer', async (offer) => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      socket.to(roomId).emit('accept-offer', offer);
    });

    socket.on('offer-accepted', async (ans) => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      socket.to(roomId).emit('offer-accepted', ans);
    });
    socket.on('nego-needed', async (offer) => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      socket.to(roomId).emit('nego-needed', offer);
    });
    socket.on('nego-done', async (ans) => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      socket.to(roomId).emit('nego-done', ans);
    });
    socket.on('call-end', async () => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      socket.to(roomId).emit('call-end');
    });

    socket.on('disconnect', async () => {
      const roomId = await redis.get(`socket:${socket.id}:room`);
      if (roomId) {
        await redis.srem(`room:${roomId}:members`, socket.id);
        const remaining = await redis.scard(`room:${roomId}:members`);

        if (remaining === 0) {
          await redis.del(`room:${roomId}`);
          await redis.del(`room:${roomId}:members`);
        }
        await redis.del(`socket:${socket.id}:room`);
      }
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