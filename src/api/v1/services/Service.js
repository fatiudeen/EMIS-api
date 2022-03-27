import { ErrorResponse } from '../helpers/response.js';

export default {
  create: async (Model, data) => {
    try {
      let model = new Model(data);
      let result = await model.save();
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  delete: async (Model, id) => {
    try {
      let result = await Model.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  findAll: async (Model, query) => {
    try {
      let result = await Model.find(query);
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  findOne: async (Model, id) => {
    try {
      let result = await Model.findOne(id);
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
  update: async (Model, id, data) => {
    try {
      let result = await Model.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      return result;
    } catch (error) {
      throw new ErrorResponse(error);
    }
  },
};
