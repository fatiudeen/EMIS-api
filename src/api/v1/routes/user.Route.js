import express from 'express';
import {
  getUser,
  updateUser,
  changePassword,
  newAvatar,
  deleteAvatar,
  getUsersFromDept,
} from '../controllers/user.controller.js';

import { allDepts, getOneDept } from '../controllers/department.controller.js';

import {
  sendMail,
  sendRequest,
  getAllMails,
  getAllRequests,
  getOneMail,
  getOneRequest,
  logs,
} from '../controllers/message.controller.js';
import { upload, avatar } from '../helpers/upload.js';
import userValidator from '../validators/user.validator.js';
import { validator } from '../middlewares/validator.js';

const router = express.Router();

//manage user data
router.get('/', getUser);

router.patch('/', userValidator.update, validator, updateUser);

router.patch('/avatar', userValidator.avatar, validator, avatar, newAvatar);

router.delete('/avatar', deleteAvatar);

router.patch('/password', userValidator.password, validator, changePassword);

//request
router.post('/request', userValidator.request, validator, upload, sendRequest);

router.get('/request', getAllRequests);

router.get('/request/:requestId', getOneRequest);

router.get('/department', allDepts);

router.get('/department/:id', getOneDept);

//mail
router.post('/mail', userValidator.mail, validator, upload, sendMail);

router.get('/mail', getAllMails);

router.get('/mail/:mailId', getOneMail);

router.get('/users', getUsersFromDept);

router.get('/users/:id', getUser);

//logs
router.get('/logs', logs);

export default router;
