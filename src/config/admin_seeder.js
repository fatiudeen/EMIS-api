import config from './config.js';
// import User from '../api/v1/models/User.model.js'
import { User } from '../api/v0/models/user.js';
import { Department } from '../api/v0/models/dept.js';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin_email;
  const defaultPassword = config.admin_password;

  //
  let doc;
  const dept = await Department.findOne({ abbr: 'ADMIN' });
  if (!dept) {
    doc = await Department.create({
      name: 'support',
      abbr: 'ADMIN',
    });
  }
  //
  const admin = await User.findOne({ email: defaultEmail });
  if (!admin) {
    await User.create({
      username: `${defaultEmail}@ADMIN`,
      name: 'admin',
      password: defaultPassword,
      role: 'Administrator',
      department: dept?._id || doc._id,
    });
    console.log(dept._id, doc._id);
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
