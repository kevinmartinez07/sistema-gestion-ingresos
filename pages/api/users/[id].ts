import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES, Role } from '@/lib/server/domain/value-objects/Role';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json(ApiResponse.badRequest('Invalid user ID'));
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
    if (role !== undefined) updateData.role = role as Role;
    if (phone !== undefined) updateData.phone = phone;

    // Ejecutar use case con Result Pattern
    const result = await appService.updateUser.execute({
      id,
      ...updateData,
    });

    // Manejo explícito de Result
    if (result.isFailure) {
      return res.status(400).json(ApiResponse.validationErrors(result.errors));
    }

    // Respuesta exitosa
    return res.status(200).json(
      ApiResponse.success({
        id: result.value.id,
        name: result.value.name,
        email: result.value.email,
        phone: result.value.phone,
        role: result.value.role,
        updatedAt: result.value.updatedAt,
      })
    );
  }

  if (req.method === 'DELETE') {
    // Ejecutar use case con Result Pattern
    const result = await appService.deleteUser.execute({ id });

    // Manejo explícito de Result
    if (result.isFailure) {
      return res.status(400).json(ApiResponse.validationErrors(result.errors));
    }

    // Respuesta exitosa
    return res
      .status(200)
      .json(
        ApiResponse.success({ message: 'Usuario eliminado correctamente' })
      );
  }

  return res.status(405).json(ApiResponse.error('Método no permitido'));
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
