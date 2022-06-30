import { Message, Conversation } from '../models/Messages.model.js';
import userService from './user.service.js';
import { ErrorResponse } from '../helpers/response.js';
import UserModel from '../models/User.model.js';

export default {
  create: async (data) => {
    try {
      let user = await userService.getUser({ username: data.to });
      if (!user) {
        throw new ErrorResponse('Invalid user', 404);
      }
      let convo = await Conversation.findOne().and([
        { recipients: user._id },
        { recipients: data.from },
        { group: false },
      ]);
      let lastMessage = data.message.body
        ? data.message.body
        : data.message.body === ''
        ? `ATTACHMENT (${data.message.attachment.length})/`
        : `ATTACHMENT (${data.message.attachment.length})`;
      if (!convo) {
        convo = new Conversation({
          recipients: [user._id, data.from],
          lastMessage,
          alias: user.name === '' ? user.username : user.name,
          group: false,
        });
      } else {
        convo.lastMessage = lastMessage;
      }
      let _convo = await convo.save();
      data.conversation = _convo._id;
      let to = await UserModel.findOne({ username: data.to });
      data.to = [to];
      let message = new Message(data);
      let result = await message.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },

  createGroup: async (data) => {
    try {
      let users = await UserModel.find().where('username').in(data.to);
      if (users === []) {
        throw new ErrorResponse('Invalid users', 404);
      }
      let _users = [];
      let __users = [];
      users.map((val) => {
        _users.push({ recipients: val._id });
        __users.push(val._id);
      });
      let convo = await Conversation.findOne().and([
        { group: true },
        { alias: data.alias },
      ]);
      if (convo) throw new ErrorResponse('group name taken', 400);

      convo = new Conversation({
        recipients: [...__users, data.from],
        lastMessage: '...start a conversation',
        alias: data.alias,
        group: true,
      });

      let result = await convo.save();

      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  sendGroup: async (data, id) => {
    try {
      let convo = await Conversation.findById(id);
      if (!convo) throw new ErrorResponse('group does not exist', 400);

      let users = convo.recipients.concat().filter((val) => {
        return val.toString() !== data.from.toString();
      });

      let lastMessage = data.message.body
        ? data.message.body
        : data.message.body === ''
        ? `ATTACHMENT (${data.message.attachment.length})`
        : `ATTACHMENT (${data.message.attachment.length})`;

      convo.lastMessage = lastMessage;

      await convo.save();
      data.to = users;
      data.conversation = convo._id;
      let message = new Message(data);
      let result = await message.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  getMessages: async (conversationId, userId) => {
    try {
      let message = await Message.find({ conversation: conversationId }).sort({
        createdAt: 1,
      });
      await Message.updateMany(
        { conversation: conversationId, seen: { $nin: [userId] } },
        { $push: { seen: userId } }
      );
      return message;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  getConversations: async (id, userId) => {
    try {
      let convo = await Conversation.find()
        .in('recipients', [id])
        .sort({ updatedAt: -1 });

      convo.map(async (val) => {
        if (!val.group) {
          let x = val.recipients.filter((vali) => {
            return vali.toString() !== id.toString();
          });
          let user = await UserModel.findById(x[0]);
          val.alias = user.name ? user.name : user.username;
        }
      });

      const result = await Promise.all(
        convo.map(async (val) => {
          const count = await Message.countDocuments({
            conversation: val._id,
            seen: { $nin: [userId] },
          });
          val.unreadMessages = count;
          return val;
        })
      );

      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  renameGroup: async (id, alias) => {
    try {
      let convo = await Conversation.findById(id);
      convo.alias = alias;
      let result = await convo.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  addToGroup: async (convoId, id) => {
    try {
      let convo = await Conversation.findById(convoId);
      convo.recipients.push(id);
      let result = await convo.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },

  removeFromGroup: async (convoId, id) => {
    try {
      let convo = await Conversation.findById(convoId);
      let _convo = convo.recipients.concat().filter((val) => {
        return val.toString() !== id.toString();
      });
      console.log(_convo);
      convo.recipients = _convo;
      let result = await convo.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
