import { Server } from 'socket.io';
import { createServer } from 'http';

import app from './src/api/v2/app.js';
import config from './src/config/config.js';

const httpServer = createServer(app);
const io = new Server(httpServer);
// app.use('/api/upload', app.express.static(__dirname + '/upload'));
// app.use('/api/avi', app.express.static(__dirname + '/avi'));
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

const IP = process.env.IP || '127.0.0.1';
const PORT = config.port;
httpServer.listen(PORT, IP, () =>
  console.log(`Server running on ${IP}:${PORT}`)
);
