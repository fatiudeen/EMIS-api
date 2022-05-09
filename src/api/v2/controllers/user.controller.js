import userService from '../services/user.service.js';
import { SuccessResponse } from '../helpers/response.js';
import departmentService from '../services/department.service.js';
import { ErrorResponse } from '../helpers/response.js';
import fs from 'fs';

//MANAGE USER DATA
// get user data
export const getUser = async (req, res, next) => {
  try {
    let id = req.params.id == null ? req.user._id : req.params.id;
    let result = await userService.getUser({ _id: id });
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
    req.user.role == 'Admin' ? (data.role = req.body.role) : false;

    if (Object.entries(data).length === 0)
      return next(new ErrorResponse('invalid input', 409));

    let id = req.params.id == null ? req.user._id : req.params.id;

    let result = await userService.updateUser(id, data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  console.log(req.body);
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
  data.password = req.body.password;
  data.role = req.body.role;
  data.username = `${req.body.username}@${req.body.department.toUpperCase()}`;
  data.name = req.body.name;
  data.rank = req.body.rank;
  data.avi = 'avi/placeholder.png';

  try {
    const user = await userService.getUser({ username: data.username });
    if (user) {
      throw new ErrorResponse('User exists', 406);
    }
    let dept = await departmentService.getDepartment({
      abbr: req.body.department,
    });
    if (!dept) {
      eq.body.username;
      throw new ErrorResponse('Department does not exist', 400);
    }
    data.department = dept._id;

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
export const getUsers = async (req, res, next) => {
  try {
    let result = await userService.getAllUsers({});
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
    if (req.user.avatar == '') {
      return SuccessResponse.success(res, 'user doesnot have an avatar', 200);
    }
    fs.unlinkSync(req.user.avatar, (err) => {
      if (err) {
        throw new ErrorResponse(err.message, 400);
      }
    });

    let result = await userService.updateUser(req.user._id, { avatar: '' });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get users of one dept
export const getUsersFromDept = async (req, res, next) => {
  let dept = req.user.role === 'Admin' ? req.params.id : req.user.department;

  try {
    let result = await userService.getAllUsers({ department: dept });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const findMany = async (req, res, next) => {
  try {
    let array = req.body.users;

    let result = await userService.findMany(array);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getDeptAndUsers = async (req, res, next) => {
  try {
    let result = await departmentService.getDeptAndUsres();
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
