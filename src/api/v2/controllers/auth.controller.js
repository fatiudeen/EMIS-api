import { SuccessResponse } from '../helpers/response.js';
import userService from '../services/user.service.js';

export default {
  //login route
  login: async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
      let result = await userService.login(username, password);
      SuccessResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  },
  /**
   * body: 'name' 'title' 'reference' 'text'
   */
  forgotPassword: async (req, res, next) => {
    try {
      let data = {};
      data.title = `${req.body.name}: ${req.body.title}`;
      data.reference = req.body.reference;
      data._to = true;
      data.message = {
        body: req.body.text,
      };

      let result = await userService.forgotPassword(data);
      SuccessResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  },
};
