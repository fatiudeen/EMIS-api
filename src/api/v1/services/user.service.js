import constants from '../../../config/constants.js';
import { ErrorResponse } from '../helpers/response.js';
import User from '../models/User.model.js';
import Service from './Service.js';

export default {
  createUser: async (data) => {
    return await Service.create(User, data);
  },

  deleteUser: async (id) => {
    return await Service.delete(User, id);
  },

  getAllUsers: async (query) => {
    return await Service.findAll(User, query);
  },

  getUser: async (id) => {
    return await Service.findOne(User, id);
  },

  updateUser: async (id, data) => {
    return await Service.update(User, id, data);
  },

  updatePasswordAdmin: async (id, password) => {
    try {
      let user = await User.findById(id).select('+password');
      user.password = password;
      let result = user.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  updatePassword: async (id, oldPassword, password) => {
    try {
      let user = await User.findById(id).select('+password');
      let match = user.comparePasswords(oldPassword);
      if (!match) {
        throw new ErrorResponse(constants.MESSAGES.PASSWORD_MATCH_ERROR);
      }
      user.password = password;
      let result = await user.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },

  login: async (username, password) => {
    try {
      let user = await User.findOne({ username }).select('+password');
      if (!user) {
        throw new ErrorResponse(constants.MESSAGES.INVALID_CREDENTIALS);
      }
      let match = user.comparePasswords(password);
      if (!match) {
        throw new ErrorResponse(constants.MESSAGES.INVALID_CREDENTIALS);
      }
      let result = await user.getSignedToken();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
