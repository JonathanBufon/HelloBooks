import { apiClient } from '../client'
import type { Livro, LivroCreate } from './types'

export async function criarLivro(payload: LivroCreate): Promise<Livro> {
  const response = await apiClient.post<Livro>('/livros', payload)

  return response.data
}
