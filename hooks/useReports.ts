/**
 * Custom hook para gestionar reportes
 * Encapsula toda la lógica de estado y operaciones
 */

import {
  ChartData,
  MonthlyData,
  ReportData,
  reportsService,
} from '@/lib/client/services/reports.service';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseReportsOptions {
  autoFetch?: boolean;
}

export function useReports(options: UseReportsOptions = {}) {
  const { autoFetch = true } = options;

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCSV, setDownloadingCSV] = useState(false);

  /**
   * Obtener datos del reporte
   */
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const reportData = await reportsService.getReportData();
      setData(reportData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar reporte';
      setError(message);
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Descargar CSV
   */
  const downloadCSV = useCallback(async () => {
    setDownloadingCSV(true);
    setError(null);

    try {
      await reportsService.downloadCSV();
      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al descargar reporte';
      setError(message);
      return { success: false, error: message };
    } finally {
      setDownloadingCSV(false);
    }
  }, []);

  /**
   * Datos preparados para gráfico de distribución
   */
  const distributionChart: ChartData[] = useMemo(() => {
    if (!data) return [];
    return reportsService.prepareDistributionChart(data);
  }, [data]);

  /**
   * Datos preparados para gráfico mensual
   */
  const monthlyChart: MonthlyData[] = useMemo(() => {
    if (!data) return [];
    return reportsService.prepareMonthlyChart(data.movements);
  }, [data]);

  /**
   * Fetch automático al montar
   */
  useEffect(() => {
    if (autoFetch) {
      fetchReport();
    }
  }, [autoFetch, fetchReport]);

  return {
    data,
    loading,
    error,
    downloadingCSV,
    distributionChart,
    monthlyChart,
    fetchReport,
    downloadCSV,
    refetch: fetchReport,
  };
}
