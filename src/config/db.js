import mongoose from 'mongoose';
import config from './config.js';
import constants from './constants.js';
import { createAdminAccount } from './admin_seeder.js';

export default () => {
  mongoose
    .connect(config.mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => createAdminAccount())
    .then(() => console.log(constants.MESSAGES.MONGODB_CONNECTED))
    .catch((err) => console.log(err));
};
