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
