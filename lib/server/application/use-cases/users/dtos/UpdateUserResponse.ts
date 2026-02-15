import { Role } from '../../../../domain/value-objects/Role';

/**
 * Response DTO para actualizar usuario
 */
export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  phone?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
