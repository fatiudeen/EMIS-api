import { check, body, param } from 'express-validator';

export default {
  avatar: [check('avatar').optional()],

  update: [
    check('name').optional().isString().trim(),
    check('rank').optional().isString().trim(),
  ],

  password: [
    check('oldPassword').isLength({ min: 6 }),
    check('newPassword').isLength({ min: 6 }),
    check('confirmPassword').custom((value, { req, loc, path }) => {
      if (value !== req.body.newPassword) {
        // throw error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
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
    check('text').optional().trim(),
    check('files').optional(),
  ],

  findMany: [check('users').isArray()],

  newGroup: [
    body('to').optional().trim(),
    body('alias').exists({ checkFalsey: true }).trim(),
  ],
  conversation: [
    check('text').optional().trim(),
    check('to').exists({ checkFalsey: true }).trim(),
  ],
  conversationGroup: [
    body('text').exists({ checkFalsey: true }).trim(),
    param('groupConvoId').exists({ checkFalsey: true }).trim(),
  ],
  renameGroup: [check('name').exists({ checkFalsey: true }).trim()],
};
