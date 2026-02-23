import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const rooms = {}; // Track roomId -> caseId

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (roomId, requestedCaseId) => {
      socket.join(roomId);
      if (!rooms[roomId]) {
        rooms[roomId] = { caseId: requestedCaseId || 'c1' };
      }
      console.log(`Socket ${socket.id} joined room ${roomId} (Case: ${rooms[roomId].caseId})`);
      io.to(roomId).emit('player-joined', socket.id);
      socket.emit('room-info', rooms[roomId].caseId);
    });

    socket.on('sync-state', ({ roomId, state }) => {
      socket.to(roomId).emit('state-update', state);
    });

    socket.on('accuse', ({ roomId, suspectId }) => {
      socket.to(roomId).emit('accused', suspectId);
    });

    socket.on('chat-message', ({ roomId, msg }) => {
      socket.to(roomId).emit('chat-message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Prune empty rooms to prevent unbounded memory growth.
      // socket.io has already removed this socket from all rooms by the time
      // the disconnect event fires, so we can check adapter room sizes directly.
      for (const roomId of Object.keys(rooms)) {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room || room.size === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} pruned (empty).`);
        }
      }
    });
  });

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
