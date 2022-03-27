import express from 'express';
import {
  registerUser,
  deleteUser,
  changePassword,
  updateUser,
  getUsers,
  getUser,
  getUsersFromDept,
} from '../controllers/user.controller.js';

import {
  createDept,
  deleteDept,
  allDepts,
  getOneDept,
} from '../controllers/department.controller.js';

import {
  sendMail,
  sendRequest,
  getAllMails,
  getAllRequests,
  getOneMail,
  getOneRequest,
} from '../controllers/message.controller.js';
import { upload } from '../helpers/upload.js';
import { validator } from '../middlewares/validator.js';
import adminValidator from '../validators/admin.validator.js';

const router = express.Router();
//manage department
router.post(
  '/dept/create',
  adminValidator.createDepartment,
  validator,
  createDept
);

router.get('/dept', allDepts);

router.get('/dept/:id/users', getUsersFromDept);

router.get('/dept/:id', getOneDept);

router.delete('/dept/:id/delete', deleteDept);

//manage user
router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post(
  '/users/create',
  adminValidator.createUser,
  validator,
  registerUser
);

router.delete('/users/:id/delete', deleteUser);

router.patch(
  '/users/:id/password',
  adminValidator.password,
  validator,
  changePassword
);

router.patch(
  '/users/:id/update',
  adminValidator.updateUser,
  validator,
  updateUser
);

//request
router.post('/request', adminValidator.request, validator, upload, sendRequest);

router.get('/request/:requestId', getAllRequests);

router.get('/request', getOneRequest);

// mail
router.post('/mail', upload, adminValidator.mail, validator, upload, sendMail);

router.get('/mail', getAllMails);

router.get('/mail/:mailId', getOneMail);

export default router;
