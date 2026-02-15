import { Role } from '../../../../domain/value-objects/Role';

/**
 * Request DTO para actualizar usuario (Command)
 */
export interface UpdateUserRequest {
  id: string;
  name?: string;
  role?: Role;
  phone?: string;
}
