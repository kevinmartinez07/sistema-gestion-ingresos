import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withErrorHandling =
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch {
      return res.status(500).json(ApiResponse.error('Internal Server Error'));
    }
  };
