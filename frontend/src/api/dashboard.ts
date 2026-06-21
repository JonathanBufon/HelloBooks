import apiClient from './client';
import type { DashboardStats } from '../types/api';

export async function getStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
}
