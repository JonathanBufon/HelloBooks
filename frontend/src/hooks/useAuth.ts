import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Usuario, AuthContextValue } from '../types/auth';
import * as authApi from '../api/auth';

export const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function getStoredUsuario(): Usuario | null {
  const raw = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function useAuthProvider(): AuthContextValue {
  const [usuario, setUsuario] = useState<Usuario | null>(getStoredUsuario);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!usuario;

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      authApi.me()
        .then((u) => {
          setUsuario(u);
          const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
          storage.setItem('usuario', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('usuario');
          setToken(null);
          setUsuario(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, senha: string, lembrar: boolean) => {
    const response = await authApi.login({ email, senha });
    const storage = lembrar ? localStorage : sessionStorage;
    storage.setItem('token', response.token);
    storage.setItem('usuario', JSON.stringify(response.usuario));
    setToken(response.token);
    setUsuario(response.usuario);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore logout failures
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }, []);

  return useMemo(() => ({
    usuario,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }), [usuario, token, isAuthenticated, isLoading, login, logout]);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
