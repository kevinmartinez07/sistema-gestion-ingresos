import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const result = await appService.getUsers.execute();

    if (result.isFailure) {
      return res.status(500).json(ApiResponse.error(result.error));
    }

    return res.status(200).json(
      ApiResponse.success(
        result.value.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        }))
      )
    );
  }

  return res.status(405).json(ApiResponse.error('Método no permitido'));
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
