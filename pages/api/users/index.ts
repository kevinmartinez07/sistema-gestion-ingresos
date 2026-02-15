import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const users = await appService.getUsers.execute();

    return res.status(200).json({
      success: true,
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
