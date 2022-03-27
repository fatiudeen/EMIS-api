import { body, check } from 'express-validator';
export default {
  login: [
    check('username').matches(/^[a-zA-Z]+@[a-zA-Z]+$/i),
    check('password').isLength({ min: 6 }),
  ],
  forgotPassword: [
    check('name').exists({ checkFalsy: true }).isString(),
    check('text').exists({ checkFalsy: true }).isString(),
    check('title').exists({ checkFalsy: true }).isString(),
  ],
};
