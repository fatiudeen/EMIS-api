import express, { urlencoded } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createServer } from 'http';

// test version
// import authRoute from './src/api/v0/routes/authRoute.js';
// import adminRoute from './src/api/v0/routes/adminRoutes.js';
// import userRoute from './src/api/v0/routes/userRoutes.js';
// import errorHandler from './src/api/v0/middlewares/errorHandler.js';
// //import db from './src/api/v0/helpers/db.js'
// import db from './src/config/db.js';
// import protect from './src/api/v0/middlewares/verify.js';
// import config from './src/config/config.js';

// version 1
import authRoute from './src/api/v1/routes/auth.Route.js';
import userRoute from './src/api/v1/routes/user.Route.js';
import adminRoute from './src/api/v1/routes/admin.Route.js';
import config from './src/config/config.js';
import { errorHandler } from './src/api/v1/middlewares/error.js';
import db from './src/config/db.js';
import protect from './src/api/v1/middlewares/protect.js';

const app = express();
const corsOptions = {
  origin: '*',
};
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use((req, res, next) => {
  req.io = io;
  next();
});

//Routes
app.use('/api/upload', protect('User'), express.static(__dirname + '/upload'));
app.use('/api', authRoute);
app.use('/api/admin', protect('Admin'), adminRoute);
app.use('/api/user', protect('User'), userRoute);
app.use('*', (req, res) => {
  res.status(500).json({
    status: 'Sorry Route does not exists',
  });
});
app.use(errorHandler);

// Database configuration
db();

const IP = process.env.IP || '127.0.0.1';
const PORT = config.port;
httpServer.listen(
  PORT,
  /*IP,*/ () => console.log(`Server running on ${IP}:${PORT}`)
);

// io.emit('message', 'i love you');
