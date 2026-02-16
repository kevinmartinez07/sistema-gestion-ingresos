import { authClient } from '@/lib/auth/client';
import {
    RegisterFormData,
    validateRegistrationForm,
} from '@/lib/utils/auth-validation';
import { parseHttpError } from '@/lib/utils/errors';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const register = async (form: RegisterFormData) => {
    setError('');

    const validationError = validateRegistrationForm(form);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
        ...(form.phone && { phone: form.phone }),
      });

      if (result.error) {
        setError(result.error.message || 'Error al crear la cuenta');
        return;
      }

      setRegistrationSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      const parsedError = parseHttpError(err);
      setError(parsedError.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    registrationSuccess,
  };
};
