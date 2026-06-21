import apiClient from '../client';
import type { Exemplar, ExemplarCreate, ExemplarUpdate } from '../../types/api';

export async function listByLivro(idLivro: number): Promise<Exemplar[]> {
  const response = await apiClient.get<Exemplar[]>(`/livros/${idLivro}/exemplares`);
  return response.data;
}

export async function create(idLivro: number, payload: ExemplarCreate): Promise<Exemplar[]> {
  const response = await apiClient.post<Exemplar[]>(`/livros/${idLivro}/exemplares`, payload);
  return response.data;
}

export async function update(id: number, payload: ExemplarUpdate): Promise<Exemplar> {
  const response = await apiClient.put<Exemplar>(`/exemplares/${id}`, payload);
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`/exemplares/${id}`);
}
