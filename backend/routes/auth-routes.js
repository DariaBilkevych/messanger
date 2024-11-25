import express from 'express';
import {
  login,
  signup,
  logout,
  refreshToken,
  resetPassword,
} from '../controllers/auth-controller.js';
import {
  signupValidation,
  loginValidation,
  resetPasswordValidation,
} from '../middelwares/validation.js';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/reset-password', resetPasswordValidation, resetPassword);

export default router;
