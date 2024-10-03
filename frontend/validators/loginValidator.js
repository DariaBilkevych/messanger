import { MIN_PASSWORD_LENGTH } from '../src/utils/constants';

export const loginValidator = (formData) => {
  const { phoneNumber, password } = formData;
  const newErrors = {};

  if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    newErrors.phoneNumber = 'Phone number should be between 10 to 15 digits';
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    newErrors.password = `Password should be at least ${MIN_PASSWORD_LENGTH} characters long`;
  }

  return newErrors;
};
