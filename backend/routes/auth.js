import express from 'express';
import {
    register,
    login,
    getMe,
    updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
    registerValidation,
    loginValidation,
    profileUpdateValidation,
    validate
} from '../middleware/validation.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileUpdateValidation, validate, updateProfile);

export default router;
