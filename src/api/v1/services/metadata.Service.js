import { ErrorResponse } from '../helpers/response.js';
import User from '../models/User.model.js';
import { Request } from '../models/Messages.model.js';
import mongoose from 'mongoose';

export default {
  forwardRequest: async (data) => {
    try {
      let _user = await User.find({ _id: data.id });
      let _req = await Request.findById(data.requestId);
      let file;
      const time = Date.now();

      if (!_user || !_req) {
        throw new ErrorResponse('user or dept error', 404);
      }
      let reg = _req.metaData.seen.find((val) => {
        return val.by.toString() == data.user._id.toString();
      });
      if (data.user.role == 'Registry' && reg == undefined) {
        _req.metaData.seen.push({
          by: data.user._id,
          date: time,
          read: true,
        });
      }
      let result = _req.metaData.seen.find((val) => {
        return val.by.toString() == data.id;
      });
      if (result == undefined) {
        _req.metaData.seen.push({
          by: data.id,
          date: time,
          read: false,
        });
        _req.metaData.forward.push(mongoose.Types.ObjectId(data.id));

        file = await _req.save();
        return file;
      }
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  seen: async (data) => {
    try {
      let _req = await Request.findById(data.requestId);
      let doc = _req.metaData.seen.find((val) => {
        return val.by.toString() == data.id;
      });
      if (doc == undefined) {
        throw new ErrorResponse('this user is not on the forward list', 400);
      }
      let result = _req.metaData.seen.map((val) => {
        if (val.by == data.user._id) {
          val.read = true;
        }
      });

      _req.metaData.seen = result;
      let file = await _req.save();
      return file;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  minute: async (data) => {
    try {
      let _req = await Request.findById(data.requestId);
      const time = Date.now();
      _req.metaData.minute.push({
        by: data.user._id,
        date: time,
        comment: data.comment,
      });
      let result = await _req.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  status: async (data) => {
    try {
      let _req = await Request.findById(data.requestId);
      _req.metaData.status = data.status;

      await _req.save();
      return true;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
