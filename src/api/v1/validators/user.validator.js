import { check } from 'express-validaror';

export default {
  avatar: [check('avatar').not().isEmpty()],
  update: [check('name').optional(), check('rank').optional()],
  password: [check('oldPassword'), check('newPassword'), check('newPassword2')],

  request: [
    check('to'),
    check('reference'),
    check('title'),
    check('text'),
    check('files'),
  ],

  mail: [check('to'), check('title'), check('text'), check('files')],
};
