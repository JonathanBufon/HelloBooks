import apiClient from './client';
import type { MultaResumo } from '../types/multa';

export async function getResumo(): Promise<MultaResumo> {
  const response = await apiClient.get<MultaResumo>('/minhas-multas/resumo');
  return response.data;
}
