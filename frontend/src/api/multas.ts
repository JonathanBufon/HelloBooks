import apiClient from './client';
import type { Multa, MultaCreate } from '../types/multa';

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
