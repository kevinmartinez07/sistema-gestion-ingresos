/** Delete user command */
import { IUserRepository } from '../../../repositories/IUserRepository';
import { Result } from '../../../shared/Result';
import { DeleteUserRequest } from '../dtos/DeleteUserRequest';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: DeleteUserRequest): Promise<Result<void>> {
    if (!request.id?.trim()) {
      return Result.fail<void>('User ID is required');
    }

    try {
      const user = await this.userRepository.findById(request.id);

      if (!user) {
        return Result.fail<void>('Usuario no encontrado');
      }

      await this.userRepository.delete(request.id);

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail<void>((error as Error).message);
    }
  }
}
