import userService from '../services/user.service.js';
import { SuccessResponse } from '../helpers/response.js';
import departmentService from '../services/department.service.js';
import { ErrorResponse } from '../helpers/response.js';
//MANAGE USER DATA
// get user data
export const getUser = async (req, res, next) => {
  try {
    let id =
      req.user.role === 'Admin'
        ? req.params.id
        : req.url == '/users/:id'
        ? req.params.id
        : req.user._id;

    let result = userService.getUser(id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//  UPDATE FULLNAME/RANK/ROLE
export const updateUser = async (req, res, next) => {
  let data = {};

  try {
    req.body.name != null ? (data.name = req.body.name) : false;
    req.body.rank != null ? (data.rank = req.body.rank) : false;
    //checking if user is an admin, as changing the role of a user can only be done an admin
    req.user.role !== 'Admin'
      ? null
      : req.body.role != null
      ? (data.role = req.body.role)
      : false;

    if (Object.entries(data).length === 0) {
      throw new ErrorResponse(); /////////////////////////////////////////////////////////////////////////////////
    }

    let id = { username: req.user.username };
    let result = await userService.updateUser(id, data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  let oldPassword = req.body.oldPassword;
  let password = req.body.newPassword;
  let result;

  try {
    if (req.user.role === 'Admin') {
      let id = req.params.id;
      //allow adimin change passwords without using old passwords
      result = await userService.updatePasswordAdmin(id, password);
    } else {
      result = await userService.updatePassword(
        req.user._id,
        oldPassword,
        password
      );
    }
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//register user
export const registerUser = async (req, res, next) => {
  let data = {};
  data.username = `${req.body.username}@${req.body.department}`;
  data.password = req.body.password;
  data.role = req.body.role;
  data.department = req.body.department;
  // console.log(data);

  try {
    let user = await userService.getUser({ username: data.username });
    if (user) {
      throw new ErrorResponse('User exists', 406);
    }
    let dept = await departmentService.getDepartment({ abbr: data.department });
    if (!dept) {
      throw new ErrorResponse('Department does not exist', 401);
    }
    data.department = dept.toUpperCase();
    let result = await userService.createUser(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    let result = await userService.deleteUser(req.params.id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get all users
export const getUsers = (req, res, next) => {
  try {
    let result = userService.getAllUsers({});
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const newAvatar = async (req, res, next) => {
  try {
    let result = await userService.updateUser(req.user._id, {
      avatar: req.file.path,
    });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//// remove avatar
export const deleteAvatar = async (req, res, next) => {
  try {
    await fs.unlink(req.user.avatar);
    let result = userService.updateUser(req.user._id, { avatar: '' });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get users of one dept
export const getUsersFromDept = (req, res, next) => {
  let dept = req.user.isAdmin === true ? req.params.id : req.user.department;

  try {
    let result = userService.getAllUsers({ department: dept });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
