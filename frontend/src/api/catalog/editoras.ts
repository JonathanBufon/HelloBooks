import apiClient from '../client';
import type { Editora, EditoraCreate, PaginatedResponse } from '../../types/api';

export interface EditoraListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export async function list(params: EditoraListParams = {}): Promise<PaginatedResponse<Editora>> {
  const response = await apiClient.get<PaginatedResponse<Editora>>('/editoras', { params });
  return response.data;
}

export async function get(id: number): Promise<Editora> {
  const response = await apiClient.get<Editora>(`/editoras/${id}`);
  return response.data;
}

export async function create(payload: EditoraCreate): Promise<Editora> {
  const response = await apiClient.post<Editora>('/editoras', payload);
  return response.data;
}

export async function update(id: number, payload: EditoraCreate): Promise<Editora> {
  const response = await apiClient.put<Editora>(`/editoras/${id}`, payload);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/editoras/${id}`);
}
