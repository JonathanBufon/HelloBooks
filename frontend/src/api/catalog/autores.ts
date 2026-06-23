import apiClient from '../client';
import type { Autor, AutorCreate, PaginatedResponse } from '../../types/api';

export interface AutorListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export async function list(params: AutorListParams = {}): Promise<PaginatedResponse<Autor>> {
  const response = await apiClient.get<PaginatedResponse<Autor>>('/autores', { params });
  return response.data;
}

export async function get(id: number): Promise<Autor> {
  const response = await apiClient.get<Autor>(`/autores/${id}`);
  return response.data;
}

export async function create(payload: AutorCreate): Promise<Autor> {
  const response = await apiClient.post<Autor>('/autores', payload);
  return response.data;
}

export async function update(id: number, payload: AutorCreate): Promise<Autor> {
  const response = await apiClient.put<Autor>(`/autores/${id}`, payload);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/autores/${id}`);
}
