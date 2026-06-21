import apiClient from './client';
import type { PaginatedResponse } from '../types/api';
import type { Multa, MultaCreate, MultaDetalhe } from '../types/multa';

export interface MultaListParams {
  page?: number;
  per_page?: number;
  status?: string;
  motivo?: string;
  id_usuario?: number;
  q?: string;
  de?: string;
  ate?: string;
}

export async function list(params: MultaListParams = {}): Promise<PaginatedResponse<Multa>> {
  const response = await apiClient.get<PaginatedResponse<Multa>>('/multas', { params });
  return response.data;
}

export async function get(id: number): Promise<MultaDetalhe> {
  const response = await apiClient.get<MultaDetalhe>(`/multas/${id}`);
  return response.data;
}

export async function create(payload: MultaCreate): Promise<Multa> {
  const response = await apiClient.post<Multa>('/multas', payload);
  return response.data;
}

export async function pagar(id: number): Promise<Multa> {
  const response = await apiClient.put<Multa>(`/multas/${id}/pagar`);
  return response.data;
}

export async function pagarTodas(idUsuario: number): Promise<Multa[]> {
  const response = await apiClient.put<Multa[]>('/multas/pagar-lote', {
    id_usuario: idUsuario,
  });
  return response.data;
}

export async function perdoar(id: number, justificativa: string): Promise<Multa> {
  const response = await apiClient.put<Multa>(`/multas/${id}/perdoar`, { justificativa });
  return response.data;
}
