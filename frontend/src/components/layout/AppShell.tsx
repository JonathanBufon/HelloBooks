import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Sidebar } from '../ds/navigation/Sidebar';
import { SidebarItem } from '../ds/navigation/SidebarItem';
import { Topbar } from '../ds/navigation/Topbar';
import { Toast as ToastComponent } from '../ds/feedback/Toast';
import { NotificationBadge } from './NotificationBadge';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  Tag,
  UserCog,
  ClipboardList,
  ClipboardCheck,
  Receipt,
  AlertCircle,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['bibliotecario', 'leitor'] },
  { path: '/catalogo', label: 'Catálogo', icon: BookOpen, roles: ['bibliotecario', 'leitor'] },
  { path: '/autores', label: 'Autores', icon: Users, roles: ['bibliotecario'] },
  { path: '/editoras', label: 'Editoras', icon: Building2, roles: ['bibliotecario'] },
  { path: '/categorias', label: 'Categorias', icon: Tag, roles: ['bibliotecario'] },
  { path: '/usuarios', label: 'Usuários', icon: UserCog, roles: ['bibliotecario'] },
  { path: '/multas', label: 'Multas', icon: Receipt, roles: ['bibliotecario'] },
  { path: '/solicitacoes-emprestimo', label: 'Solicitações', icon: ClipboardCheck, roles: ['bibliotecario'] },
  { path: '/minhas-multas', label: 'Minhas Multas', icon: AlertCircle, roles: ['leitor'] },
  { path: '/minhas-solicitacoes', label: 'Minhas Solicitações', icon: ClipboardCheck, roles: ['leitor'] },
  { path: '/auditoria', label: 'Auditoria', icon: ClipboardList, roles: ['bibliotecario'] },
] as const;

export function AppShell() {
  const { usuario, logout } = useAuth();
  const { toasts, dismiss } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  const cargo = usuario?.cargo ?? 'leitor';
  const filteredNav = NAV_ITEMS.filter((item) => (item.roles as readonly string[]).includes(cargo));

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        logoHref="/"
        logo={<span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>HelloBooks</span>}
        footer={
          <SidebarItem
            icon={<LogOut size={20} />}
            label="Sair"
            onClick={handleLogout}
          />
        }
      >
        {filteredNav.map((item) => (
          <SidebarItem
            key={item.path}
            icon={<item.icon size={20} />}
            label={item.label}
            active={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Sidebar>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar
          userName={usuario?.nome_completo ?? ''}
          userRole={cargo === 'bibliotecario' ? 'Bibliotecário' : 'Leitor'}
          searchValue={searchValue}
          onSearchChange={handleSearch}
          onSearchSubmit={handleSearchSubmit}
          onUserClick={() => navigate('/perfil')}
          actions={cargo === 'leitor' ? <NotificationBadge /> : undefined}
        />

        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: 'var(--space-6)',
          background: 'var(--color-bg-primary)',
        }}>
          <Outlet />
        </main>
      </div>

      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            tone={toast.type === 'error' ? 'danger' : toast.type as 'success' | 'danger' | 'warning' | 'info'}
            message={toast.message}
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
