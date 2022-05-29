import { ErrorResponse } from '../helpers/response.js';
import { Request } from '../models/Messages.model.js';
import Service from './Service.js';
import departmentService from './department.service.js';
import UserModel from '../models/User.model.js';
import sendService from './send.service.js';
import DepartmentModel from '../models/Department.model.js';

export default {
  createRequest: async (data, user) => {
    let request = await Request.findOne({ reference: data.reference });
    if (request) {
      throw new ErrorResponse('Request Exists', 409);
    }
    if (user.role !== 'Registry') {
      data._to = false;
      // data.to = undefined;
    } else {
      data._to = true;
    }
    let _to;
    let _from;
    if (data.onModel === 'User') {
      _to = await UserModel.findOne({ username: data.to });
      _from = user._id;
      data._to = true;
      if (!_to) throw new ErrorResponse('Invalid User', 404);
    } else {
      _to = await departmentService.getDepartment({ abbr: data.to });
      if (!_to) throw new ErrorResponse('Invalid Department', 404);
      _from = user.department;
    }
    const time = Date.now();

    let _req = new Request(data);
    _req.metaData.forward = [user._id];
    _req.metaData.seen.push({
      by: user._id,
      date: time,
      read: false,
    });
    // } else {
    _req.to = _to._id;
    _req.from = _from;
    // }
    let result = await _req.save();
    return result;
    // return await Service.create(Request, data);
  },

  deleteRequest: async (id, user) => {
    const _req = await Service.findOne(Request, id);
    if (_req.from.toString() !== user.toString()) {
      throw new ErrorResponse('cannot delete a task you did not request', 404);
    }

    return await Service.delete(Request, id);
  },

  getAllRequests: async (query) => {
    return await Service.findAll(Request, query);
  },

  getRequest: async (id) => {
    return await Service.findOne(Request, id);
  },

  updateRequest: async (data) => {
    return await Service.update(Request, id, data);
  },
  getMyRequest: async (data) => {
    try {
      let request = await Request.find().or([...data]);
      return request;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  approveRequest: async (id) => {
    try {
      let request = await Request.findById(id);
      request._to = true;
      let result = await request.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  supportMail: async (data) => {
    try {
      let _user = await UserModel.findOne({ username: 'support@ADMIN' });
      data.to = _user._id;

      let _mail = await Request.create(data);
      return _mail;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  broadcast: async (requestId, user, note, userRequset) => {
    try {
      let request = await Request.findById(requestId);
      let data = {};
      let num = 0;
      let result;
      if (userRequset) {
        let members = await UserModel.find({ department: user.department });
        data.from = user._id;
        data.message = {
          body: `${note} | ${request.title} | ${request.message.body}`,
          attachment: request.message.attachment,
        };
        note ? '' : note;
        members.forEach(async (val) => {
          data.to = val._id;
          await sendService.create(data);
          num = num + 1;
        });
        result = { usersBroadcastedTo: num, message: request };
      } else {
        request.from = user.department;
        if (note) request.message.text = `${request.message.body} | ${note}`;
        let department = await DepartmentModel.find();
        department.forEach(async (val) => {
          request.to = val.abbr;
          await this.createRequest(request, user);
          num = num + 1;
        });
        result = { departmentsBroadcastedTo: num, message: request };
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
