import config from '../../../config/config.js';
import DepartmentModel from '../models/Department.model.js';
import User from '../models/User.model.js';
import { ErrorResponse } from './response.js';

export const createAdminAccount = async () => {
  const defaultEmail = config.admin_email;
  const defaultPassword = config.admin_password;
  try {
    const admin = await User.findOne({
      username: `${defaultEmail}@ADMIN`,
    }).select('+password');

    const department = await DepartmentModel.findOne({ abbr: 'ADMIN' });

    if (!admin) {
      await User.create({
        username: `${defaultEmail}@ADMIN`,
        name: 'admin',
        password: defaultPassword,
        role: 'Admin',
        department: department._id,
      });
    } else {
      admin.department = department._id;
      admin.password = defaultPassword;
      admin.role = 'Admin';

      await admin.save();
    }
  } catch (error) {
    throw new ErrorResponse(error);
  }
};

export const createAdminDept = async () => {
  let data = {};
  data.name = 'Admin Department';
  data.abbr = 'ADMIN';
  try {
    const admin = await DepartmentModel.findOne({ abbr: 'ADMIN' });

    if (!admin) {
      await DepartmentModel.create(DataView);
    }
    await admin.save();
  } catch (error) {
    throw new ErrorResponse(error);
  }
};
