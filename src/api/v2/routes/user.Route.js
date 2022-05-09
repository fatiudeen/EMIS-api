import express from 'express';
import {
  getUser,
  updateUser,
  changePassword,
  newAvatar,
  deleteAvatar,
  getUsersFromDept,
  findMany,
  getDeptAndUsers,
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
  seen,
  minute,
  status,
  forwardRequest,
  send,
  sendGroup,
  getConversations,
  getMessages,
  renameGroup,
  addUserToGroup,
  removeFromGroup,
  leaveGroup,
  approveRequest,
  createGroup,
} from '../controllers/message.controller.js';
import { upload, avatar } from '../helpers/upload.js';
import userValidator from '../validators/user.validator.js';
import { validator } from '../middlewares/validator.js';

const router = express.Router();

//manage user data
router.get('/user', getUser);
router.patch('/profile/update', userValidator.update, validator, updateUser);
router.post(
  '/profile/avatar',
  avatar,
  // userValidator.avatar,
  // validator,
  newAvatar
);
router.delete('/profile/avatar', deleteAvatar);
router.patch(
  '/profile/password',
  userValidator.password,
  validator,
  changePassword
);
router.post('/findmany', userValidator.findMany, validator, findMany);

//request
router.post('/request', upload, userValidator.request, validator, sendRequest);
router.get('/request', getAllRequests);
router.get('/request/:requestId', getOneRequest);
router.get('/department', allDepts);
router.get('/department/:id', getOneDept);
router.get('/request/forward/:id/:requestId', forwardRequest);
router.get('/request/approve/:requestId', approveRequest);

//mail
router.post('/mail', upload, userValidator.mail, validator, sendMail);
router.get('/mail', getAllMails);
router.get('/mail/:mailId', getOneMail);
router.get('/users', getUsersFromDept);
router.get('/users/:id', getUser);

// send
router.post('/convo', upload, userValidator.conversation, validator, send);
router.post(
  '/convo-new-group',
  /*userValidator.newGroup, validator,*/ createGroup
);
router.post(
  '/convo-group/:groupConvoId',
  upload,
  userValidator.conversationGroup,
  validator,
  sendGroup
);

router.get('/convo', getConversations);
router.get('/convo/:convoId', getMessages);
router.patch(
  '/convo/:convoId',
  userValidator.renameGroup,
  validator,
  renameGroup
);
router.get('/convo/:convoId/:userId', addUserToGroup);
router.delete('/convo/:convoId/:userId', removeFromGroup);
router.delete('/convo/:convoId', leaveGroup);
router.get('/all', getDeptAndUsers);

//logs
router.get('/logs', logs);

// metadata
router.get('/metadata/:requestId/', seen);
router.post('/metadata/:requestId', minute); //comment
router.get('/metadata/:requestId/:status', status);

export default router;
