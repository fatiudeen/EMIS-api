import express from 'express';
import {
  registerUser,
  deleteUser,
  changePassword,
  updateUser,
  getUsers,
  getUser,
} from '../controllers/user.js';

import {
  createDept,
  deleteDept,
  allDepts,
  getOneDept,
  getUsersFromDept,
} from '../controllers/dept.js';

import { sendMail, getAllMails, getOneMail } from '../controllers/messages.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
//manage department
router.post('/dept/create', createDept);

router.get('/dept', allDepts);

router.get('/dept/:id/users', getUsersFromDept);

router.get('/dept/:id', getOneDept);

router.delete('/dept/:id/delete', deleteDept);

//manage user
router.get('/users', getUsers);

router.get('/users/:id', getUser);

router.post('/users/create', registerUser);

router.delete('/users/:id/delete', deleteUser);

router.patch('/users/:id/password', changePassword);

router.patch('/users/:id/update', updateUser);

//mail
router.post('/mail', upload, sendMail);

router.get('/mail', getAllMails);

router.get('/mail/:mailId', getOneMail);

export default router;
