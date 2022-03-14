import config from '../config';
import User from '../api/users/users.model';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin.email;
  const defaultPassword = config.admin.password;
  const admin = await User.findOne({ email: defaultEmail });
  if (!admin) {
    await User.create({
      username: defaultEmail,
      name: 'admin',
      password: defaultPassword,
      role: 'Admin',
    });
  } else {
    admin.password = defaultPassword;
    await admin.save();
  }
};
