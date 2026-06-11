export type Autor = {
  id_autor: number
  nome: string
  created_at?: string
  updated_at?: string
}

export type Editora = {
  id_editora: number
  nome: string
  created_at?: string
  updated_at?: string
}

export type Categoria = {
  id_categoria: number
  nome: string
  created_at?: string
  updated_at?: string
}

export type Livro = {
  id_livro: number
  titulo: string
  isbn: string
  ano_publicacao: number
  id_editora: number
  editora?: Editora
  autores?: Autor[]
  categorias?: Categoria[]
  created_at?: string
  updated_at?: string
}

export type Exemplar = {
  id_exemplar: number
  id_livro: number
  status: 'disponivel' | 'emprestado' | 'reservado' | 'manutencao'
  condicao_fisica: 'intacto' | 'rabiscado' | 'rasgado' | 'dobrado'
  created_at?: string
  updated_at?: string
}

export type LivroCreate = {
  titulo: string
  isbn: string
  ano_publicacao: number
  id_editora?: number
  editora?: { nome: string }
  autores: Array<{ id_autor: number } | { nome: string }>
  categorias: Array<{ id_categoria: number } | { nome: string }>
}
