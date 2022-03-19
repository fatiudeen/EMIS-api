import config from './config.js';
//import User from '../api/v1/models/User.model.js';
import { User } from '../api/v0/models/user.js';
import { ErrorResponse } from '../api/v1/helpers/response.js';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin_email;
  const defaultPassword = config.admin_password;
  try {
    const admin = await User.findOne({
      username: `${defaultEmail}@ADMIN`,
    }).select('+password');

    if (!admin) {
      await User.create({
        username: `${defaultEmail}@ADMIN`,
        name: 'admin',
        password: defaultPassword,
        role: 'Admin',
      });
    } else {
      admin.password = defaultPassword;
      admin.role = 'Admin';

      await admin.save();
    }
  } catch (error) {
    throw new ErrorResponse(error);
  }
};
