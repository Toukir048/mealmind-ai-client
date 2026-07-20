import { api } from './api';
import type { DashboardSummary } from '../types/dashboard';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await api.get<{ data: DashboardSummary }>('/dashboard/summary');
  return data.data;
};
