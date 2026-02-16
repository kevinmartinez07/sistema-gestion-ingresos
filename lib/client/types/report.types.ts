/**
 * Frontend DTOs for Report domain
 * These are separate from backend use case DTOs
 */

import { MovementResponseDTO } from './movement.types';

export interface BalanceResponseDTO {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface ReportStatsProps {
  balance: BalanceResponseDTO;
  movementsCount: number;
  avgIncome: number;
  avgExpense: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface MonthlyChartProps {
  data: MonthlyData[];
}

export interface DistributionChartProps {
  totalIncome: number;
  totalExpense: number;
}

export interface RecentMovementsTableProps {
  movements: MovementResponseDTO[];
}
