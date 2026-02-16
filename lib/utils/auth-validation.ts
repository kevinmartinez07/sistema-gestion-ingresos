export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ValidationError {
  message: string;
}

export const validateRegistrationForm = (
  form: RegisterFormData
): ValidationError | null => {
  if (!form.name || !form.email || !form.password) {
    return { message: 'Todos los campos son requeridos' };
  }

  if (form.password !== form.confirmPassword) {
    return { message: 'Las contraseñas no coinciden' };
  }

  if (form.password.length < 6) {
    return { message: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return null;
};
