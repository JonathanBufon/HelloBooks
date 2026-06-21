import apiClient from './client';
import type { MinhasMultasResponse, MultaResumo } from '../types/multa';

export interface MinhasMultasListParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export async function getResumo(): Promise<MultaResumo> {
  const response = await apiClient.get<MultaResumo>('/minhas-multas/resumo');
  return response.data;
}

export async function list(params: MinhasMultasListParams = {}): Promise<MinhasMultasResponse> {
  const response = await apiClient.get<MinhasMultasResponse>('/minhas-multas', { params });
  return response.data;
}
