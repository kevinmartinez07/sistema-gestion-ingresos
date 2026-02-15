import { auth } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/server/application/errors/AppErrors';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withAuth =
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        headers.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    const session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      throw new UnauthorizedError();
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user.role as 'ADMIN' | 'USER') || 'ADMIN',
    };

    return handler(req, res);
  };
