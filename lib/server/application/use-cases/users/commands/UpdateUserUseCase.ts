/** Update user command */
import { IUserRepository } from '../../../repositories/IUserRepository';
import { Result } from '../../../shared/Result';
import { UpdateUserRequest } from '../dtos/UpdateUserRequest';
import { UpdateUserResponse } from '../dtos/UpdateUserResponse';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: UpdateUserRequest): Promise<Result<UpdateUserResponse>> {
    if (!input.id?.trim()) {
      return Result.fail<UpdateUserResponse>('User ID is required');
    }

    try {
      const user = await this.userRepository.findById(input.id);

      if (!user) {
        return Result.fail<UpdateUserResponse>('Usuario no encontrado');
      }

      const updatedUser = await this.userRepository.update(input.id, {
        name: input.name,
        role: input.role,
        phone: input.phone,
      });

      const response: UpdateUserResponse = {
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

      return Result.ok(response);
    } catch (error) {
      return Result.fail<UpdateUserResponse>((error as Error).message);
    }
  }
}
