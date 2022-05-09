import { Mail } from '../models/Messages.model.js';
import Service from './Service.js';
import userService from './user.service.js';
import { ErrorResponse } from '../helpers/response.js';
import User from '../models/User.model.js';

export default {
  createMail: async (data) => {
    try {
      let user = await userService.getUser({ username: data.to });
      if (!user) {
        throw new ErrorResponse('Invalid user', 404);
      }
      if (data.to === data.from) {
        throw new ErrorResponse('Forbbidden: cannot select this user', 403);
      }
      data.to = user._id;
      return await Service.create(Mail, data);
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },

  deleteMail: async (id) => {
    return await Service.delete(Mail, id);
  },

  getAllMails: async (query) => {
    return await Service.findAll(Mail, query);
  },

  getMail: async (id) => {
    return await Service.findOne(Mail, id);
  },

  updateMail: async (data) => {
    return await Service.update(Mail, id, data);
  },
  supportMail: async (data) => {
    try {
      let _user = await User.findOne({ username: 'support@ADMIN' });
      data.to = _user._id;

      let _mail = await Mail.create(data);
      return _mail;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  getMyMail: async (data, data1) => {
    try {
      let mail = await Mail.find().or([data, data1]);
      return mail;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
