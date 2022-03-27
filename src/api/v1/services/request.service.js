import { ErrorResponse } from '../helpers/response.js';
import { Request } from '../models/Messages.model.js';
import Service from './Service.js';
import departmentService from './department.service.js';

export default {
  createRequest: async (data) => {
    let request = await Request.findOne({ reference: data.reference });
    if (request) {
      throw new ErrorResponse('Request Exists', 409);
    }
    let department = await departmentService.getDepartment({ abbr: data.to });
    if (!department) {
      throw new ErrorResponse('Invalid Department', 404);
    }
    if (data.to === data.from) {
      throw new ErrorResponse('Forbbidden: cannot select this Department', 403);
    }
    data.to = department._id;
    return await Service.create(Request, data);
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
};
