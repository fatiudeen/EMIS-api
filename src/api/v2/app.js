import express, { urlencoded } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import { Server } from 'socket.io';
// import { createServer } from 'http';

import authRoute from './routes/auth.Route.js';
import userRoute from './routes/user.Route.js';
import adminRoute from './routes/admin.Route.js';
import { errorHandler, error404 } from './middlewares/error.js';
import protect from './middlewares/protect.js';

const app = express();
const corsOptions = {
  origin: '*',
};
// const httpServer = createServer(app);
// const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

//Routes
app.use(
  '/api/upload',
  protect('User'),
  express.static(__dirname + '/../../../upload')
);
app.use('/api/avi', express.static(__dirname + '/../../../avi'));
app.use('/api', authRoute);
app.use('/api/admin', protect('Admin'), adminRoute);
app.use('/api/user', protect('User'), userRoute);
app.use('*', error404);
app.use(errorHandler);

export default app;
