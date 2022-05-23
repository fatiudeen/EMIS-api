import express from 'express';
import authController from '../controllers/auth.controller.js';
import { validator } from '../middlewares/validator.js';
import authValidator from '../validators/auth.validator.js';
const router = express.Router();

router.post('/login', authValidator.login, validator, authController.login);

router.post(
  '/problem',
  authValidator.forgotPassword,
  validator,
  authController.forgotPassword
);

export default router;
