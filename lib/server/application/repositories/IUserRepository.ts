import { User } from '../../domain/entities/User';
import { UpdateUserData } from '../use-cases/users/dtos/UserRepositoryDTO';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
