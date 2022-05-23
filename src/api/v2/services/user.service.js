import constants from '../../../config/constants.js';
import { ErrorResponse } from '../helpers/response.js';
import User from '../models/User.model.js';
import Service from './Service.js';
import mongoose from 'mongoose';
import mailService from './mail.service.js';
import requestService from './request.service.js';

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
      let match = await user.comparePasswords(oldPassword);
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
      let user = await User.findOne({ username })
        .select('+password')
        .populate('department');
      if (!user) {
        throw new ErrorResponse(constants.MESSAGES.INVALID_CREDENTIALS);
      }
      let match = user.comparePasswords(password);
      if (!match) {
        throw new ErrorResponse(constants.MESSAGES.INVALID_CREDENTIALS);
      }
      let result = {};
      result.token = await user.getSignedToken();
      result.doc = user;
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  forgotPassword: async (data) => {
    const username = `forgot@PASSWORD`;
    const defaultPassword = Math.floor(Math.random() * 10000000);
    let randomUser;

    try {
      randomUser = await User.findOne({
        username,
      }).select('+password');

      if (!randomUser) {
        randomUser = new User({
          username,
          name: 'DHQ USER',
          password: defaultPassword,
          role: 'Admin',
        });
      } else {
        randomUser.password = defaultPassword;
        randomUser.role = 'Admin';
      }
      await randomUser.save();

      data.from = randomUser._id;

      data.to = 'support@ADMIN';

      let mail = await requestService.createRequest(data);
      return mail;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  findMany: async (array) => {
    try {
      array = array.map((val) => {
        return mongoose.Types.ObjectId(val);
      });
      let result = await User.find().where('_id').in(array);
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
