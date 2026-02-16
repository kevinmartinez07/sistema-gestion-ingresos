import { appService } from '@/lib/server/application/ApplicationService';
import { MovementType } from '@/lib/server/domain/entities/Movement';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
import { ApiResponse } from '@/lib/server/presentation/helpers/ApiResponse';
import { withAuth } from '@/lib/server/presentation/middlewares/withAuth';
import { withErrorHandling } from '@/lib/server/presentation/middlewares/withErrorHandling';
import { withRole } from '@/lib/server/presentation/middlewares/withRole';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { type, startDate, endDate } = req.query;

    interface MovementFilters {
      type?: MovementType;
      startDate?: Date;
      endDate?: Date;
    }

    const filters: MovementFilters = {};
    if (type) filters.type = type as MovementType;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const result = await appService.getMovements.execute(filters);

    if (result.isFailure) {
      return res.status(500).json(ApiResponse.error(result.error));
    }

    return res.status(200).json(
      ApiResponse.success(
        result.value.map((m) => ({
          id: m.id,
          type: m.type,
          amount: m.amount,
          concept: m.concept,
          date: m.date,
          userId: m.userId,
          user: m.user,
          createdAt: m.createdAt,
          updatedAt: m.updatedAt,
        }))
      )
    );
  }

  if (req.method === 'POST') {
    // Crear nuevo movimiento (solo ADMIN)
    if (req.user?.role !== 'ADMIN') {
      return res
        .status(403)
        .json(
          ApiResponse.forbidden(
            'Solo los administradores pueden crear movimientos'
          )
        );
    }

    const { type, amount, concept, date } = req.body;

    // Validaciones básicas de campos requeridos
    if (!type || amount === undefined || !concept || !date) {
      return res
        .status(400)
        .json(
          ApiResponse.badRequest(
            'Faltan campos requeridos: tipo, monto, concepto, fecha'
          )
        );
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res
        .status(400)
        .json(
          ApiResponse.badRequest('Tipo inválido. Debe ser INCOME o EXPENSE')
        );
    }

    // Ejecutar use case con Result Pattern
    const result = await appService.createMovement.execute({
      type,
      amount: Number(amount),
      concept,
      date: new Date(date),
      userId: req.user!.id,
    });

    // Manejo explícito de Result
    if (result.isFailure) {
      return res.status(400).json(ApiResponse.validationErrors(result.errors));
    }

    // Respuesta exitosa
    return res.status(201).json(ApiResponse.success(result.value));
  }

  return res.status(405).json(ApiResponse.error('Método no permitido'));
};

export default withErrorHandling(
  withAuth(withRole([ROLES.ADMIN, ROLES.USER])(handler))
);
