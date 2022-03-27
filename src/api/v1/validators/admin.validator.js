import { check } from 'express-validator';
export default {
  createDepartment: [
    check('name').exists({ checkFalsey: true }).isString(),
    check('abbr').exists({ checkFalsey: true }).isString(),
  ],
  createUser: [
    check('username').exists({ checkFalsey: true }).isString().trim(),
    check('password').isLength({ min: 6 }),
    check('role').exists(),
    check('department').exists(),
  ],
  password: [check('newPassword').isLength({ min: 6 })],
  updateUser: [check('name').optional(), check('rank').optional()],
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
    check('file').optional(),
  ],
};
