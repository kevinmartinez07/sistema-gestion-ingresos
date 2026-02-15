import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid movement ID',
    });
  }

  if (req.method === 'DELETE') {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can delete movements',
      });
    }

    await appService.deleteMovement.execute({ id });

    return res.status(200).json({
      success: true,
      message: 'Movement deleted successfully',
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
