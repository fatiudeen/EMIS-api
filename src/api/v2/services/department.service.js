import { ErrorResponse } from '../helpers/response.js';
import Department from '../models/Department.model.js';
import Service from './Service.js';

export default {
  createDepartment: async (data) => {
    let department = Service.findOne(data);
    if (!department) {
      throw new ErrorResponse();
    }
    return await Service.create(Department, data);
  },

  deleteDepartment: async (id) => {
    return await Service.delete(Department, id);
  },

  getAllDepartments: async (query) => {
    return await Service.findAll(Department, query);
  },

  getDepartment: async (id) => {
    let result = await Service.findOne(Department, id);
    return result;
  },

  updateDepartment: async (data) => {
    return await Service.update(Department, id, data);
  },
};
