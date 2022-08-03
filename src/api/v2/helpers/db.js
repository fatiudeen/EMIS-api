import mongoose from 'mongoose';
import config from '../../../config/config.js';
import constants from '../../../config/constants.js';
import { createAdminAccount, createAdminDept } from './admin_seeder.js';

export default () => {
  mongoose
    .connect(config.mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => createAdminDept())
    .then(() => createAdminAccount())
    // .then(() => User.syncIndexes())
    .then(() => console.log('seed created'))
    .then(() => console.log(constants.MESSAGES.MONGODB_CONNECTED))
    .catch((err) => console.log(err));
};
