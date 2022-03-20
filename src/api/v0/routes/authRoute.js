import express from 'express';
import { login, forgotPassword } from '../controllers/login.js';

const router = express.Router();

router.post('/login', login);

router.post('/problem', forgotPassword);

export default router;
