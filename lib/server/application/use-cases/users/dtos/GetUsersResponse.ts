import { Role } from '../../../../domain/value-objects/Role';

/**
 * Response DTO para obtener usuarios (Query)
 */
export interface GetUsersResponse {
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
