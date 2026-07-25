export const validateRequired = (value, fieldName = "field") => {
  const cleaned = typeof value === "string" ? value.trim() : value;
  if (cleaned === null || cleaned === undefined || cleaned === "") {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value, min, fieldName = "field") => {
  const cleaned = typeof value === "string" ? value.trim() : value;
  if (cleaned === null || cleaned === undefined || cleaned === "") {
    return `${fieldName} is required`;
  }
  if (String(cleaned).length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

export const validateEmail = (value) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || !emailPattern.test(value)) {
    return "Please enter a valid email";
  }
  return null;
};

export const validateForm = (fields) => {
  const errors = {};
  Object.entries(fields).forEach(([key, value]) => {
    if (value?.validator) {
      const message = value.validator(value.value);
      if (message) errors[key] = message;
    }
  });
  return errors;
};
