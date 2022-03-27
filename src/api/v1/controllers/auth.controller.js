import { SuccessResponse } from '../helpers/response.js';
import userService from '../services/user.service.js';

//login route
export const login = async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  try {
    let result = await userService.login(username, password);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    let data = {};
    data.title = `${req.body.name}: ${req.body.title}`;

    data.message = {
      body: req.body.text,
    };
    let result = await userService.forgotPassword(data);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
