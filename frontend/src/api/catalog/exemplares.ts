import { apiClient } from '../client'
import type { Exemplar, ExemplarUpdate } from './types'

export async function registrarLote(
  idLivro: number,
  quantidade: number,
): Promise<Exemplar[]> {
  const response = await apiClient.post<Exemplar[]>(`/livros/${idLivro}/exemplares`, {
    quantidade,
  })

  return response.data
}

export async function atualizarExemplar(
  idExemplar: number,
  payload: ExemplarUpdate,
): Promise<Exemplar> {
  const response = await apiClient.put<Exemplar>(`/exemplares/${idExemplar}`, payload)

  return response.data
}

export const atualizar = atualizarExemplar
