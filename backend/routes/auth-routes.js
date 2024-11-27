import express from 'express';
import {
  login,
  signup,
  logout,
  refreshToken,
  resetPassword,
  verifyPhoneNumber,
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
router.post('/verify-number', verifyPhoneNumber);
router.post('/reset-password/:id', resetPasswordValidation, resetPassword);

export default router;
