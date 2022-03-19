import { check } from 'express-validator';
export default [
  check('username').matches(/^[a-zA-Z]+@[a-zA-Z]+$/i),
  check('password').isLength({ min: 6 }),
];
