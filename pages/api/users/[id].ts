import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES, Role } from '@/lib/server/domain/value-objects/Role';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid user ID',
    });
  }

  if (req.method === 'PUT') {
    const { name, role, phone } = req.body;

    interface UpdateData {
      name?: string;
      role?: Role;
      phone?: string;
    }

    const updateData: UpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) {
      if (!['ADMIN', 'USER'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be ADMIN or USER',
        });
      }
      updateData.role = role as Role;
    }
    if (phone !== undefined) updateData.phone = phone;

    const user = await appService.updateUser.execute({
      id,
      ...updateData,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        updatedAt: user.updatedAt,
      },
    });
  }

  if (req.method === 'DELETE') {
    await appService.deleteUser.execute({ id });

    return res.status(200).json({
      success: true,
      data: { message: 'Usuario eliminado correctamente' },
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
