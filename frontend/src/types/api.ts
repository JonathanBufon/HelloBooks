export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Livro {
  id_livro: number;
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  id_editora: number;
  editora?: Editora;
  autores?: Autor[];
  categorias?: Categoria[];
  created_at?: string;
  updated_at?: string;
}

export interface LivroDetalhe extends Livro {
  exemplares: Exemplar[];
  contagem_exemplares: {
    disponivel: number;
    emprestado: number;
    reservado: number;
    manutencao: number;
  };
}

export interface LivroCreate {
  titulo: string;
  isbn: string;
  ano_publicacao: number;
  id_editora: number;
  autores: Array<{ id_autor: number } | { nome: string }>;
  categorias: Array<{ id_categoria: number } | { nome: string }>;
}

export interface LivroUpdate {
  titulo?: string;
  isbn?: string;
  ano_publicacao?: number;
  id_editora?: number;
  autores?: Array<{ id_autor: number }>;
  categorias?: Array<{ id_categoria: number }>;
}

export type ExemplarStatus = 'disponivel' | 'emprestado' | 'reservado' | 'manutencao';
export type CondicaoFisica = 'intacto' | 'rabiscado' | 'rasgado' | 'dobrado';

export interface Exemplar {
  id_exemplar: number;
  id_livro: number;
  status: ExemplarStatus;
  condicao_fisica: CondicaoFisica;
  created_at?: string;
  updated_at?: string;
}

export interface ExemplarUpdate {
  status?: 'disponivel' | 'manutencao';
  condicao_fisica?: CondicaoFisica;
}

export interface ExemplarCreate {
  quantidade: number;
}

export interface Autor {
  id_autor: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export interface AutorCreate {
  nome: string;
}

export interface Editora {
  id_editora: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export interface EditoraCreate {
  nome: string;
}

export interface Categoria {
  id_categoria: number;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriaCreate {
  nome: string;
}

export type AcaoRealizada = 'created' | 'updated' | 'deleted';

export interface LogEntry {
  id_log: number;
  acao_realizada: AcaoRealizada;
  entidade_afetada: string;
  id_registro_afetado: string;
  data_hora: string;
  usuario?: {
    id_usuario: number;
    nome_completo: string;
  };
}

export interface DashboardStats {
  total_livros: number;
  total_exemplares: number;
  exemplares_por_status: {
    disponivel: number;
    emprestado: number;
    reservado: number;
    manutencao: number;
  };
  total_autores: number;
  total_editoras: number;
  total_categorias: number;
  total_usuarios: number;
  livros_recentes: Array<{
    id_livro: number;
    titulo: string;
    autores: string[];
    created_at: string;
  }>;
  atividade_recente: LogEntry[];
}
