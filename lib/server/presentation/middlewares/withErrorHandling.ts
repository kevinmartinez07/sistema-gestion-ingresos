import { AppError } from '@/lib/server/application/errors/AppErrors';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const withErrorHandling =
  (handler: NextApiHandler): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error: unknown) {
      console.error('❌ ERROR EN API:', error);
      
      if (error instanceof AppError) {
        return res
          .status(error.status)
          .json({ code: error.code, message: error.message });
      }

      return res
        .status(500)
        .json({ code: 'INTERNAL_ERROR', message: 'Internal Server Error' });
    }
  };
