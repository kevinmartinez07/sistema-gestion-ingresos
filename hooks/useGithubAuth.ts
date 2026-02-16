import { authClient } from '@/lib/auth/client';
import { parseHttpError } from '@/lib/utils/errors';
import { useState } from 'react';

export const useGithubAuth = (callbackURL: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginWithGithub = async () => {
    setLoading(true);
    setError('');

    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL,
      });
    } catch (err) {
      setLoading(false);
      const parsedError = parseHttpError(err);
      setError(parsedError.message);
    }
  };

  return {
    loginWithGithub,
    loading,
    error,
  };
};
