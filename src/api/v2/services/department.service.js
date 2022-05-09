import { ErrorResponse } from '../helpers/response.js';
import Department from '../models/Department.model.js';
import Service from './Service.js';

export default {
  createDepartment: async (data) => {
    let department = await Department.findOne({ abbr: data.abbr });
    if (department) {
      throw new ErrorResponse('department exists');
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
  getDeptAndUsres: async () => {
    try {
      let result = await Department.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'department',
            as: 'users',
          },
        },
      ]);
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
