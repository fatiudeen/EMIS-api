import express from 'express';
import userController from '../controllers/user.controller.js';
import departmentController from '../controllers/department.controller.js';
import taskController from '../controllers/task.controller.js';
import { upload, avatar } from '../helpers/upload.js';
import userValidator from '../validators/user.validator.js';
import { validator } from '../middlewares/validator.js';

const router = express.Router();

//manage user data
router.get('/user', userController.get);
router.patch(
  '/profile/update',
  userValidator.update,
  validator,
  userController.update
);
router.post(
  '/profile/avatar',
  avatar,
  // userValidator.avatar,
  // validator,
  userController.newAvatar
);
router.delete('/profile/avatar', userController.deleteAvatar);
router.patch(
  '/profile/password',
  userValidator.password,
  validator,
  userController.updatePassword
);
router.post(
  '/findmany',
  userValidator.findMany,
  validator,
  userController.findMany
);

//request
router.post(
  '/request',
  upload,
  userValidator.request,
  validator,
  taskController.tasks.send
);
router.get('/request', taskController.tasks.getAll);
router.get('/request/:requestId', taskController.tasks.getOne);
router.get('/department', departmentController.getAll);
router.get('/department/:id', departmentController.getOne);
router.get(
  '/request/forward/:id/:requestId',
  taskController.metaData.forwardRequest
);
router.get(
  '/request/approve/:requestId',
  taskController.metaData.approveRequest
);
router.post('/request/approve/:requestId', taskController.metaData.broadcast);

router.get('/users', userController.getUsersFromDept);
router.get('/users/:id', userController.get);

// send
router.post(
  '/convo',
  upload,
  userValidator.conversation,
  validator,
  taskController.convo.personal.send
);
router.post(
  '/convo-new-group',
  /*userValidator.newGroup, validator,*/ taskController.convo.group.createGroup
);
router.post(
  '/convo-group/:groupConvoId',
  upload,
  userValidator.conversationGroup,
  validator,
  taskController.convo.group.send
);

router.get('/convo', taskController.convo.get);
router.get('/convo/:convoId', taskController.convo.getMessages);
router.patch(
  '/convo/:convoId',
  userValidator.renameGroup,
  validator,
  taskController.convo.group.renameGroup
);
router.get(
  '/convo/:convoId/:userId',
  taskController.convo.group.addUserToGroup
);
router.delete(
  '/convo/:convoId/:userId',
  taskController.convo.group.removeFromGroup
);
router.delete('/convo/:convoId', taskController.convo.group.leaveGroup);
router.get('/all', userController.userDepartmentAggregate);

//logs
router.get('/logs', taskController.logs.get);
router.post('/logs', taskController.logs.add);

// metadata
router.get('/metadata/:requestId/', taskController.metaData.seen);
router.post('/metadata/:requestId', taskController.metaData.minute);
router.get('/metadata/:requestId/:status', taskController.metaData.status);

//support
// router.post('/support', taskController.support.send);

export default router;
