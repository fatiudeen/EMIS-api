import { check } from 'express-validator';
export default [check('username'), check('password')];
