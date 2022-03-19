import { check } from 'express-validator';

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
      .equals('newPassword')
      .withMessage('password does not match'),
  ],

  request: [
    check('to').exists({ checkFalsey: true }),
    check('reference').exists({ checkFalsey: true }).trim(),
    check('title').exists({ checkFalsey: true }).trim(),
    check('text').optional().isString().trim(),
    check('files').optional(),
  ],

  mail: [
    check('to').exists({ checkFalsey: true }),
    check('title').exists({ checkFalsey: true }).trim(),
    check('text').exists({ checkFalsey: true }).trim(),
    check('files').optional(),
  ],
};
