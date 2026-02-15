import { NotFoundError } from '../../../errors/AppErrors';
import { IUserRepository } from '../../../repositories/IUserRepository';
import { UpdateUserRequest } from '../dtos/UpdateUserRequest';
import { UpdateUserResponse } from '../dtos/UpdateUserResponse';

/**
 * Command: Actualizar información de usuario
 * Responsabilidad: Validar y actualizar datos de usuario
 */
export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (input.name !== undefined) {
      if (!input.name || input.name.trim().length === 0) {
        throw new Error('Name cannot be empty');
      }
    }

    const updatedUser = await this.userRepository.update(input.id, {
      name: input.name,
      role: input.role,
      phone: input.phone,
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      emailVerified: updatedUser.emailVerified,
      image: updatedUser.image,
      phone: updatedUser.phone,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
