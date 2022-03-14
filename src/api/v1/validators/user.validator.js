import { check } from 'express-validaror';

export default {
  avatar: [check('avatar').optional()],

  update: [
    check('name').optional().isString().trim(),
    check('rank').optional().isString().trim(),
  ],

  password: [
    check('oldPassword').isLength({ min: 6 }),
    check('newPassword').isLength({ min: 6 }),
    check('newPassword2')
      .equals(req.body.newPassword)
      .withMessage('password does not match'),
  ],

  request: [
    check('to').exist({ checkFalsey: true }),
    check('reference').exist({ checkFalsey: true }).trim(),
    check('title').exist({ checkFalsey: true }).trim(),
    check('text').optional().string().trim(),
    check('files').optional(),
  ],

  mail: [
    check('to').exist({ checkFalsey: true }),
    check('title').exist({ checkFalsey: true }).trim(),
    check('text').exist({ checkFalsey: true }).trim(),
    check('files').optional(),
  ],
};
