import { IUserRepository } from '../../application/repositories/IUserRepository';
import { UpdateUserData } from '../../application/use-cases/users/dtos/UserRepositoryDTO';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/value-objects/Role';
import { prisma } from '../prisma/client';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => this.toDomain(u));
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.role && { role: data.role }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
    });

    return this.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return await prisma.user.count();
  }

  private toDomain(prismaUser: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    phone?: string | null;
  }): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.emailVerified,
      prismaUser.role as Role,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.image ?? undefined,
      prismaUser.phone ?? undefined
    );
  }
}
