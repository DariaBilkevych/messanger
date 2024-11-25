import { body } from 'express-validator';

export const signupValidation = [
  body('firstName')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'First name is required and should be between 1 and 30 characters'
    ),
  body('lastName')
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage('Last name should not exceed 30 characters'),
  body('phoneNumber')
    .isString()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage(
      'Phone number must be between 10 to 15 digits, optionally starting with a "+"'
    ),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const loginValidation = [
  body('phoneNumber')
    .isString()
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage(
      'Phone number must be between 10 to 15 digits, optionally starting with a "+"'
    ),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const resetPasswordValidation = [
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('newPassword')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];
