import { apiClient } from '../client'
import type { Exemplar } from './types'

export async function registrarLote(
  idLivro: number,
  quantidade: number,
): Promise<Exemplar[]> {
  const response = await apiClient.post<Exemplar[]>(`/livros/${idLivro}/exemplares`, {
    quantidade,
  })

  return response.data
}
