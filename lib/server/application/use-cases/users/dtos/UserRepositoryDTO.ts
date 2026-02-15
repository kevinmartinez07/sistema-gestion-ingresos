import { Role } from '../../../../domain/value-objects/Role';

export interface UpdateUserData {
  name?: string;
  role?: Role;
  phone?: string;
}
