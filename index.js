import express, { urlencoded } from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';

// test version
import authRoute from './src/api/v0/routes/authRoute.js';
import adminRoute from './src/api/v0/routes/adminRoutes.js';
import userRoute from './src/api/v0/routes/userRoutes.js';
import errorHandler from './src/api/v0/middlewares/errorHandler.js';
//import db from './src/api/v0/helpers/db.js'
import db from './src/config/db.js';
import protect from './src/api/v0/middlewares/verify.js';
import config from './src/config/config.js';

// version 1
// import authRoute from './src/api/v1/routes/auth.route.js'
// import userRoute from './src/api/v1/routes/user.route.js'
// import adminRoute from './src/api/v1/routes/admin.route.js'
// import config from './src/config/config.js';
// import { errorHandler } from './src/api/v1/middlewares/error.js';
// import db from './src/config/db.js';
// import protect from './src/api/v1/middlewares/protect.js';

const app = express();

//middlewares
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

//Routes
app.use('/api', authRoute);
app.use('/api/admin', protect('admin'), adminRoute);
app.use('/api/user', protect('user'), userRoute);
app.use('*', (req, res) => {
  res.status(500).json({
    status: 'Sorry Route does not exists',
  });
});
app.use(errorHandler);

// Database configuration
db();

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
