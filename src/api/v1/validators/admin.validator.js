export default {
  createDepartment: [check('name'), check('abbr')],
  createUser: [
    check('username').exist({ checkFalsey: true }).isString().trim(),
    check('password').isLength({ min: 6 }),
    check('role').exist(),
    check('department'),
  ],
  password: [check('oldPassword'), check('newPassword')],
  updateUser: [check('name').optional(), check('rank').optional()],
  request: [
    check('to'),
    check('reference'),
    check('title'),
    check('text'),
    check('files'),
  ],

  mail: [check('to'), check('title'), check('text'), check('files')],
};
