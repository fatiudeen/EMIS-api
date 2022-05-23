import express from 'express';
import userController from '../controllers/user.controller.js';
import departmentController from '../controllers/department.controller.js';
import taskController from '../controllers/task.controller.js';
import { upload } from '../helpers/upload.js';
import { validator } from '../middlewares/validator.js';
import adminValidator from '../validators/admin.validator.js';

const router = express.Router();

//manage department
router.post(
  '/dept/create',
  adminValidator.createDepartment,
  validator,
  departmentController.create
);
router.get('/dept', departmentController.getAll);
router.get('/dept/:id/users', userController.getUsersFromDept);
router.get('/dept/:id', departmentController.getOne);
router.delete('/dept/:id/delete', departmentController.delete);

//manage user
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.get);
router.post(
  '/users/create',
  adminValidator.createUser,
  validator,
  userController.create
);
router.delete('/users/:id/delete', deleteUser);
router.patch(
  '/users/:id/password',
  adminValidator.password,
  validator,
  userController.updatePassword
);
router.patch(
  '/users/:id/update',
  adminValidator.updateUser,
  validator,
  userController.update
);

//request
router.post(
  '/request',
  adminValidator.request,
  validator,
  upload,
  taskController.tasks.send
);
router.get('/request', taskController.tasks.getAll);
router.get('/request/:requestId', taskController.tasks.getOne);

export default router;
