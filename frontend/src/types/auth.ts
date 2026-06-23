export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  usuario: Usuario;
}

export type Cargo = 'bibliotecario' | 'leitor';

export interface Usuario {
  id_usuario: number;
  nome_completo: string;
  email: string;
  cargo: Cargo;
  endereco?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UsuarioCreate {
  nome_completo: string;
  email: string;
  senha: string;
  cargo: Cargo;
  endereco?: string | null;
}

export interface UsuarioUpdate {
  nome_completo?: string;
  email?: string;
  senha?: string;
  cargo?: Cargo;
  endereco?: string | null;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, senha: string, lembrar: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUsuario?: (usuario: Usuario) => void;
}
