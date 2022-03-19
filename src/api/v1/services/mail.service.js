import { Mail } from '../models/Messages.model.js';
import Service from './Service.js';
import userService from './user.service.js';

export default {
  createMail: async (data) => {
    let user = await userService.getUser({ username: data.to });
    if (!user) {
      throw new ErrorResponse('Invalid user', 404);
    }
    if (data.to === data.from) {
      throw new ErrorResponse('Forbbidden: cannot select this user', 403);
    }
    data.to = user._id;
    let mail = await Mail.findOne({
      to: data.to,
      from: data.from,
      'message.title': data.message.title,
    });
    if (mail) {
      return next(new ErrorResponse('mail Exists', 409));
    }
    return await Service.create(Mail, data);
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
};
