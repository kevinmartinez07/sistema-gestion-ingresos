/**
 * Frontend DTOs for Movement domain
 * These are separate from backend use case DTOs
 */

export interface MovementResponseDTO {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  concept: string;
  date: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface MovementFiltersProps {
  searchTerm: string;
  filterType: 'ALL' | 'INCOME' | 'EXPENSE';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'ALL' | 'INCOME' | 'EXPENSE') => void;
}

export interface MovementFormData {
  type: 'INCOME' | 'EXPENSE';
  amount: string;
  concept: string;
  date: string;
}

export interface MovementFormProps {
  onSubmit: (data: MovementFormData) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export interface MovementStatsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  count: number;
}

export interface MovementTableProps {
  movements: MovementResponseDTO[];
  isAdmin: boolean;
  searchTerm: string;
  onDelete: (id: string) => void;
}

export interface MovementRowProps {
  movement: MovementResponseDTO;
  isAdmin: boolean;
  onDelete: (id: string) => void;
}
