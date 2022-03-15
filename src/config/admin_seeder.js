import config from './config.js';
// import User from '../api/v1/models/User.model.js'
import { User } from '../api/v0/models/user.js';
import { Department } from '../api/v0/models/dept.js';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin_email;
  const defaultPassword = config.admin_password;
  const admin = await User.findOne({ email: defaultEmail });
  if (!admin) {
    await User.create({
      username: `${defaultEmail}@ADMIN`,
      name: 'admin',
      password: defaultPassword,
      role: 'Administrator',
    });
  }
  // if (!admin) {
  //   await User.create({
  //     username: defaultEmail,
  //     name: 'admin',
  //     password: defaultPassword,
  //     role: 'Admin',
  //   });
  // }
  else {
    admin.password = defaultPassword;
    await admin.save();
  }
};
