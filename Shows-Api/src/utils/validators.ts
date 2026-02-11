const emailRegex = /\w+(\w|\d)*@\w+(\w|\d)*\.\w+(\w|\d)/;

export const isEmailValid = (email: string): boolean => {
  if (!email) return false;
  if (email.length > 254) return false;

  const valid = emailRegex.test(email);
  if (!valid) return false;

  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");
  if (domainParts.some((part) => part.length > 63)) return false;

  return true;
};

const usernameRegex = /^([A-Za-z0-9\-\_]+)$/;

export const isUsernameValid = (username: string): boolean => {
  if (!username) return false;
  if (username.length < 4 || username.length > 15) return false;

  const valid = usernameRegex.test(username);
  if (!valid) return false;

  return true;
};

export const createPasswordStrengthValidator = (
  password: string
): boolean => {
  if (!password) return false;

  const hasUpperCase = /[A-Z]+/.test(password);
  const hasLowerCase = /[a-z]+/.test(password);
  const hasNumeric = /[0-9]+/.test(password);

  return hasUpperCase && hasLowerCase && hasNumeric;
};
