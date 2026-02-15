/**
 * Service para operaciones relacionadas con reportes
 * Separa la lógica de API del componente
 */

import { MovementResponseDTO } from '@/types/movement.types';
import { apiClient, ApiResponse } from '../api/client';

export interface ReportData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  movementsCount: number;
  movements: MovementResponseDTO[];
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  ingresos: number;
  egresos: number;
}

class ReportsService {
  /**
   * Obtener datos del reporte
   */
  async getReportData(): Promise<ReportData> {
    const response = await apiClient.get<ApiResponse<ReportData>>('/reports');

    if (!response.data) {
      throw new Error('No data returned from server');
    }

    return response.data;
  }

  /**
   * Descargar reporte en formato CSV
   */
  async downloadCSV(): Promise<void> {
    try {
      const response = await fetch('/api/reports?format=csv');

      if (!response.ok) {
        throw new Error('Error downloading CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      throw new Error('Error downloading CSV file');
    }
  }

  /**
   * Preparar datos para gráfico de pastel
   */
  prepareDistributionChart(data: ReportData): ChartData[] {
    return [
      {
        name: 'Ingresos',
        value: data.totalIncome,
        color: '#10b981',
      },
      {
        name: 'Egresos',
        value: data.totalExpense,
        color: '#ef4444',
      },
    ];
  }

  /**
   * Preparar datos para gráfico de barras
   */
  prepareMonthlyChart(movements: MovementResponseDTO[]): MonthlyData[] {
    const monthlyMap = new Map<string, { ingresos: number; egresos: number }>();

    movements.forEach((movement) => {
      const date = new Date(movement.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { ingresos: 0, egresos: 0 });
      }

      const monthData = monthlyMap.get(monthKey)!;
      if (movement.type === 'INCOME') {
        monthData.ingresos += Number(movement.amount);
      } else {
        monthData.egresos += Number(movement.amount);
      }
    });

    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const date = new Date(Number(year), Number(month) - 1);
        return {
          month: date.toLocaleDateString('es-ES', { month: 'short' }),
          ingresos: data.ingresos,
          egresos: data.egresos,
        };
      });
  }
}

export const reportsService = new ReportsService();
