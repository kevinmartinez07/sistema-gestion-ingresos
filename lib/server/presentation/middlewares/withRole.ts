import { Role } from '@/lib/server/domain/value-objects/Role';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withRole =
  (allowedRoles: Role[]) =>
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = req;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json(ApiResponse.forbidden());
    }
    return handler(req, res);
  };
