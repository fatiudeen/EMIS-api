import express, { urlencoded } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// test version
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoutes.js';
import userRoute from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import protect from './middlewares/verify.js';
import db from './helpers/db.js';

const app = express();
const corsOptions = {
  origin: '*',
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cors(corsOptions));

//Routes
app.use('/api/upload', protect('User'), express.static(__dirname + '/upload'));
app.use('/api/avi', express.static(__dirname + '/avi'));
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
export default app;
