import { Server } from 'socket.io';
import app from 'app';
import http from 'http';
import { Logger } from '@libs/logger';

const server = http.createServer(app);
const logger = new Logger();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  cookie: true,
});

const connectedSokets: string[] = [];

io.on('connection', function (socket) {
  connectedSokets.push(socket.id);
  logger.Info(`Sockets connected: ${connectedSokets.length}`);
  //   socket.on('activeUsers', async (user) => {
  //     const activeUsers = await userController.GetAll(user);
  //     socket.emit('activeUsers', activeUsers);
  //   });

  socket.on('disconnect', () => {
    const index = connectedSokets.indexOf(socket.id);
    connectedSokets.splice(index, 1);
    logger.Info(`Sockets connected: ${connectedSokets.length}`);
  });
});

export default server;
