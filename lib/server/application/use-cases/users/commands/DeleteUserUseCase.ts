import { IUserRepository } from '../../../repositories/IUserRepository';
import { DeleteUserRequest } from '../dtos/DeleteUserRequest';

/**
 * Command: Eliminar usuario
 * Responsabilidad: Eliminar un usuario del sistema
 */
export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(request: DeleteUserRequest): Promise<void> {
    const { id } = request;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await this.userRepository.delete(id);
  }
}
