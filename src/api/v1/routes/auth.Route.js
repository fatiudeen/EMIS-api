import express from 'express';
import { forgotPassword, login } from '../controllers/auth.controller.js';
import { validator } from '../middlewares/validator.js';
import authValidator from '../validators/auth.validator.js';
const router = express.Router();

router.post('/login', authValidator.login, validator, login);

router.post(
  '/problem',
  authValidator.forgotPassword,
  validator,
  forgotPassword
);

export default router;
