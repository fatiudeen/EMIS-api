import { ErrorResponse } from '../helpers/response.js';
import { Request } from '../models/Messages.model.js';
import Service from './Service.js';
import departmentService from './department.service.js';

export default {
  createRequest: async (data, user) => {
    let request = await Request.findOne({ reference: data.reference });
    if (request) {
      throw new ErrorResponse('Request Exists', 409);
    }
    let department = await departmentService.getDepartment({ abbr: data.to });
    if (!department) {
      throw new ErrorResponse('Invalid Department', 404);
    }
    // if (data.to === data.from) {
    //   throw new ErrorResponse('Forbbidden: cannot select this Department', 403);
    // }
    // if (user.role !== 'Registry') {
    //   data._to = department._id;
    //   data.to = undefined;
    //   lod
    const time = Date.now();

    let _req = new Request(data);
    _req.metaData.forward = [user._id];
    _req.metaData.seen.push({
      by: user._id,
      date: time,
      read: false,
    });
    // } else {
    _req.to = department._id;
    _req._to = department._id;
    // }
    let result = await _req.save();
    return result;
    // return await Service.create(Request, data);
  },

  deleteRequest: async (id) => {
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
  getMyRequest: async (data, data1) => {
    try {
      let request = await Request.find().or([data, data1]);
      return request;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  approveRequest: async (id) => {
    try {
      let request = await Request.findById(id);
      request.to = request._to;
      request._to = undefined;
      let result = await request.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
