import apiClient from './client';
import type { AcaoRealizada, LogEntry, PaginatedResponse } from '../types/api';

export interface LogListParams {
  page?: number;
  per_page?: number;
  entidade?: string;
  acao?: AcaoRealizada | '';
  id_usuario?: number;
  de?: string;
  ate?: string;
}

export async function list(params: LogListParams = {}): Promise<PaginatedResponse<LogEntry>> {
  const response = await apiClient.get<PaginatedResponse<LogEntry>>('/logs', { params });
  return response.data;
}
