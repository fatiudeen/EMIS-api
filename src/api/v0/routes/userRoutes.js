import express from 'express';
import { getUser, updateUser, changePassword } from '../controllers/user.js';

import { newProfileImg, deleteProfileImg } from '../controllers/upload.js';
import { allDepts, getOneDept, getUsersFromDept } from '../controllers/dept.js';

import {
  sendMail,
  sendRequest,
  getAllMails,
  getAllRequests,
  getOneMail,
  getOneRequest,
  logs,
  forwardRequset,
} from '../controllers/messages.js';
import { upload, avatar } from '../middlewares/upload.js';

const router = express.Router();

//manage user data
router.get('/user', getUser);

router.post('/profile/avatar', avatar, newProfileImg);

router.delete('/profile/avatar', deleteProfileImg);

router.patch('/profile/update', updateUser);

router.patch('/profile/password', changePassword);

//request
router.post('/request', upload, sendRequest);

router.get('/request', getAllRequests);

router.get('/request/:requestId', getOneRequest);

router.get('/department', allDepts);

router.get('/department/:id', getOneDept);

router.get('request/forward/:id/:requestId', forwardRequset);

//mail
router.post('/mail', upload, sendMail);

router.get('/mail', getAllMails);

router.get('/mail/:mailId', getOneMail);

router.get('/users', getUsersFromDept);

router.get('/users/:id', getUser);

//logs
router.get('/logs', logs);

export default router;
