import { IUserRepository } from '../../../repositories/IUserRepository';
import { Result } from '../../../shared/Result';
import { GetUsersResponse } from '../dtos/GetUsersResponse';

/** Get users query */
export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<Result<GetUsersResponse[]>> {
    const users = await this.userRepository.findAll();

    const response = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return Result.ok(response);
  }

  async getById(id: string): Promise<GetUsersResponse | null> {
    const user = await this.userRepository.findById(id);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getByEmail(email: string): Promise<GetUsersResponse | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
