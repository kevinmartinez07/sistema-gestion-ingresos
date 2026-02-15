import { appService } from '@/lib/server/application/ApplicationService';
import { MovementType } from '@/lib/server/domain/entities/Movement';
import { ROLES } from '@/lib/server/domain/value-objects/Role';
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

    const movements = await appService.getMovements.execute(filters);

    return res.status(200).json({
      success: true,
      data: movements.map((m) => ({
        id: m.id,
        type: m.type,
        amount: m.amount,
        concept: m.concept,
        date: m.date,
        userId: m.userId,
        user: m.user,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
    });
  }

  if (req.method === 'POST') {
    // Crear nuevo movimiento (solo ADMIN)
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can create movements',
      });
    }

    const { type, amount, concept, date } = req.body;

    // Validaciones
    if (!type || !amount || !concept || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, amount, concept, date',
      });
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid type. Must be INCOME or EXPENSE',
      });
    }

    const movement = await appService.createMovement.execute({
      type,
      amount: Number(amount),
      concept,
      date: new Date(date),
      userId: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: movement.id,
        type: movement.type,
        amount: movement.amount,
        concept: movement.concept,
        date: movement.date,
        userId: movement.userId,
        createdAt: movement.createdAt,
        updatedAt: movement.updatedAt,
      },
    });
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

export default withErrorHandling(
  withAuth(withRole([ROLES.ADMIN, ROLES.USER])(handler))
);
