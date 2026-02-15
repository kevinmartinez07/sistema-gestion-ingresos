import { ForbiddenError } from '@/lib/server/application/errors/AppErrors';
import { Role } from '@/lib/server/domain/value-objects/Role';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withRole =
  (allowedRoles: Role[]) =>
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req;
    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenError();
    }
    return handler(req, res);
  };
