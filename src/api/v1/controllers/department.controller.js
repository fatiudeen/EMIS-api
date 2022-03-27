import departmentService from '../services/department.service.js';
import { ErrorResponse, SuccessResponse } from '../helpers/response.js';

//create department
export const createDept = async (req, res, next) => {
  /**
   * abbr represents the abbreviation of the department name
   */
  let data = {};
  data.name = req.body.name;
  data.abbr = req.body.abbr;
  try {
    const dept = await departmentService.getDepartment({ abbr: data.abbr });
    if (dept) {
      throw new ErrorResponse('Department Exists', 409);
    }
    const result = await departmentService.createDepartment(data);
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
export const allDepts = async (req, res, next) => {
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
    let result = await departmentService.getDepartment({ _id: req.params.id });
    SuccessResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};
