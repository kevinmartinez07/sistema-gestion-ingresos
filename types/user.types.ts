/**
 * Frontend DTOs for User domain
 * These are separate from backend use case DTOs
 */

export interface UserResponseDTO {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'USER';
  phone: string | null;
  image: string | null;
  createdAt: Date;
  emailVerified: boolean;
  banned: boolean;
  banReason: string | null;
  banExpires: number | null;
}

export interface ExtendedUser {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'USER';
  phone: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  banned: boolean;
  banReason: string | null;
  banExpires: number | null;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface UserTableProps {
  users: UserResponseDTO[];
  searchTerm: string;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
  currentUserId?: string;
}

export interface UserRowProps {
  user: UserResponseDTO;
  onEdit: (user: UserResponseDTO) => void;
  onDelete: (user: UserResponseDTO) => void;
  currentUserId?: string;
}

export interface UserStatsProps {
  total: number;
  admins: number;
  regularUsers: number;
}

export interface UserSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface UserEditFormProps {
  user: UserResponseDTO | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}
