import { appService } from '@/lib/server/application/ApplicationService';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json(ApiResponse.badRequest('Invalid movement ID'));
  }

  if (req.method === 'DELETE') {
    // Verificar que solo ADMIN puede eliminar
    if (req.user?.role !== 'ADMIN') {
      return res
        .status(403)
        .json(
          ApiResponse.forbidden(
            'Solo los administradores pueden eliminar movimientos'
          )
        );
    }

    // Ejecutar use case con Result Pattern
    const result = await appService.deleteMovement.execute({ id });

    // Manejo explícito de Result
    if (result.isFailure) {
      return res.status(400).json(ApiResponse.validationErrors(result.errors));
    }

    // Respuesta exitosa
    return res
      .status(200)
      .json(ApiResponse.success({ message: 'Movement deleted successfully' }));
  }

  return res.status(405).json(ApiResponse.error('Método no permitido'));
};

export default withErrorHandling(withAuth(withRole([ROLES.ADMIN])(handler)));
