import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Cargo } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles?: Cargo[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, usuario } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-text-muted)',
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && usuario && !allowedRoles.includes(usuario.cargo)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
