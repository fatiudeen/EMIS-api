import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { validator } from '../middlewares/validator.js';
import authValidator from '../validators/auth.validator.js';
const router = express.Router();

router.post('/login', authValidator, validator, login);

export default router;
