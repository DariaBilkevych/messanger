import { MIN_PASSWORD_LENGTH } from '../utils/constants';

export const validatePassword = (formData) => {
  const { newPassword, confirmPassword } = formData;
  const errors = {};

  if (!newPassword || !confirmPassword) {
    errors.password = 'All fields must be filled';
  } else if (newPassword !== confirmPassword) {
    errors.password = 'New password and confirm password do not match';
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.password = `New password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  return errors;
};
