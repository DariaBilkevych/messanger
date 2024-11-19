import { MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '../utils/constants';

export const validateName = (firstName, lastName) => {
  const errors = {};

  if (!firstName || !lastName) {
    errors.name = 'Name fields cannot be empty';
  } else if (
    firstName.length > { MAX_NAME_LENGTH } ||
    lastName.length > { MAX_NAME_LENGTH }
  ) {
    errors.name = 'Name cannot exceed 20 characters';
  }

  return errors;
};

export const validatePassword = (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const errors = {};

  if (!currentPassword || !newPassword || !confirmPassword) {
    errors.password = 'All fields must be filled';
  } else if (newPassword !== confirmPassword) {
    errors.password = 'New password and confirm password do not match';
  } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
    errors.password = `New password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  return errors;
};
