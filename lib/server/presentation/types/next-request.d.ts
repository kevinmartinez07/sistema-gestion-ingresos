import type { Role } from '@/lib/server/domain/value-objects/Role';

export type RequestUser = {
  id: string;
  email: string;
  role: Role;
};

declare module 'next' {
  interface NextApiRequest {
    user?: RequestUser;
  }
}
