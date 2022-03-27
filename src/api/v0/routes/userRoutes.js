import express from 'express';
import {
  getUser,
  updateUser,
  changePassword,
  findMany,
} from '../controllers/user.js';

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
  forwardRequest,
  seen,
  minute,
  status,
  supportMail,
} from '../controllers/messages.js';
import { upload, avatar } from '../middlewares/upload.js';

const router = express.Router();

//manage user data
router.get('/user', getUser);

router.post('/profile/avatar', avatar, newProfileImg);

router.delete('/profile/avatar', deleteProfileImg);

router.patch('/profile/update', updateUser);

router.patch('/profile/password', changePassword);

router.post('/findmany', findMany);
//request
router.post('/request', upload, sendRequest);

router.get('/request', getAllRequests);

router.get('/request/:requestId', getOneRequest);

router.get('/department', allDepts);

router.get('/department/:id', getOneDept);

router.get('/request/forward/:id/:requestId', forwardRequest);

//mail
router.post('/mail', upload, sendMail);

router.get('/mail', getAllMails);

router.get('/mail/:mailId', getOneMail);

router.get('/users', getUsersFromDept);

router.get('/users/:id', getUser);

//logs
router.get('/logs', logs);

// support
router.post('/support', upload, supportMail);

// meta data

router.get('/metadata/:requestId/', seen);

// router.get('/metadata/:requestId', forwardedTo);

router.post('/metadata/:requestId', minute); //comment

router.get('/metadata/:requestId/:status', status);

export default router;
