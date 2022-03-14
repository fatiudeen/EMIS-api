import departmentService from '../services/department.service.js';
import { SuccessResponse } from '../helpers/response.js';

//create department
export const createDept = async (req, res, next) => {
  /**
   * abbr represents the abbreviation of the department name
   */
  let { name, abbr } = req.body;
  try {
    const result = await departmentService.create({ name, abbr });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//delete department
export const deleteDept = async (req, res, next) => {
  try {
    let result = await departmentService.deleteDepartment(req.params.id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//get all dept
export const allDepts = (req, res, next) => {
  try {
    let result = await departmentService.getAllDepartments({});
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

//find one dept
export const getOneDept = async (req, res, next) => {
  try {
    let result = await departmentService.getDepartment(req.params.id);
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
