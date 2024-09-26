export const signUpValidator = (formData) => {
  const { firstName, lastName, phoneNumber, password } = formData;
  const newErrors = {};

  if (!firstName || firstName.length < 1 || firstName.length > 30) {
    newErrors.firstName = 'Required and should be between 1 and 30 characters';
  }
  if (!lastName || lastName.length < 1 || lastName.length > 30) {
    newErrors.lastName = 'Required and should be between 1 and 30 characters';
  }
  if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    newErrors.phoneNumber = 'Should be between 10 to 15 digits';
  }
  if (!password || password.length < 8) {
    newErrors.password = 'Should be at least 8 characters long';
  }

  return newErrors;
};
