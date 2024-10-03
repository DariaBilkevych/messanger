import { MAX_NAME_LENGTH, MIN_PASSWORD_LENGTH } from '../utils/constants';

export const signUpValidator = (formData) => {
  const { firstName, lastName, phoneNumber, password } = formData;
  const newErrors = {};

  if (
    !firstName ||
    firstName.length < 1 ||
    firstName.length > MAX_NAME_LENGTH
  ) {
    newErrors.firstName = `Required and should be between 1 and ${MAX_NAME_LENGTH} characters`;
  }
  if (!lastName || lastName.length < 1 || lastName.length > MAX_NAME_LENGTH) {
    newErrors.lastName = `Required and should be between 1 and ${MAX_NAME_LENGTH} characters`;
  }
  if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    newErrors.phoneNumber = 'Should be between 10 to 15 digits';
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    newErrors.password = `Should be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  return newErrors;
};
