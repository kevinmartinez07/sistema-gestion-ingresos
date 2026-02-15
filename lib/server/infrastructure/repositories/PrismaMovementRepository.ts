import { Prisma } from '@prisma/client';
import { IMovementRepository } from '../../application/repositories/IMovementRepository';
import {
  CreateMovementData,
  MovementFilters,
  UpdateMovementData,
} from '../../application/use-cases/movements/dtos/MovementRepositoryDTO';
import { Movement, MovementType } from '../../domain/entities/Movement';
import { prisma } from '../prisma/client';

export class PrismaMovementRepository implements IMovementRepository {
  async create(data: CreateMovementData): Promise<Movement> {
    const movement = await prisma.movement.create({
      data: {
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        concept: data.concept,
        date: data.date,
        userId: data.userId,
      },
    });

    return this.toDomain(movement);
  }

  async findById(id: string): Promise<Movement | null> {
    const movement = await prisma.movement.findUnique({
      where: { id },
    });

    return movement ? this.toDomain(movement) : null;
  }

  async findAll(filters?: MovementFilters): Promise<Movement[]> {
    const where: Prisma.MovementWhereInput = {};

    if (filters) {
      if (filters.userId) where.userId = filters.userId;
      if (filters.type) where.type = filters.type;
      if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) where.date.gte = filters.startDate;
        if (filters.endDate) where.date.lte = filters.endDate;
      }
    }

    const movements = await prisma.movement.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: true,
      },
    });

    return movements.map((m) => this.toDomain(m));
  }

  async update(id: string, data: UpdateMovementData): Promise<Movement> {
    const updateData: Prisma.MovementUpdateInput = {};

    if (data.type !== undefined) updateData.type = data.type;
    if (data.amount !== undefined)
      updateData.amount = new Prisma.Decimal(data.amount);
    if (data.concept !== undefined) updateData.concept = data.concept;
    if (data.date !== undefined) updateData.date = data.date;

    const movement = await prisma.movement.update({
      where: { id },
      data: updateData,
    });

    return this.toDomain(movement);
  }

  async delete(id: string): Promise<void> {
    await prisma.movement.delete({
      where: { id },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.movement.count({
      where: { userId },
    });
  }

  async getTotalBalance(userId?: string): Promise<number> {
    const [income, expense] = await Promise.all([
      this.getTotalIncome(userId),
      this.getTotalExpense(userId),
    ]);
    return income - expense;
  }

  async getTotalIncome(userId?: string): Promise<number> {
    const result = await prisma.movement.aggregate({
      where: {
        type: 'INCOME',
        ...(userId && { userId }),
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  async getTotalExpense(userId?: string): Promise<number> {
    const result = await prisma.movement.aggregate({
      where: {
        type: 'EXPENSE',
        ...(userId && { userId }),
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }

  private toDomain(prismaMovement: {
    id: string;
    type: string;
    amount: number | { toNumber: () => number };
    concept: string;
    date: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }): Movement & { user?: { id: string; name: string; email: string } } {
    const movement = new Movement(
      prismaMovement.id,
      prismaMovement.type as MovementType,
      Number(prismaMovement.amount),
      prismaMovement.concept,
      prismaMovement.date,
      prismaMovement.userId,
      prismaMovement.createdAt,
      prismaMovement.updatedAt
    );

    return prismaMovement.user
      ? Object.assign(movement, { user: prismaMovement.user })
      : movement;
  }
}
