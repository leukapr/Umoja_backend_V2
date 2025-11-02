import express from 'express';
import { getProfile, login, register } from '../controllers/auth.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getProfile);

export default router;
