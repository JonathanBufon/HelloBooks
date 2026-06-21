import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { CatalogoListaPage } from './features/catalog/CatalogoListaPage';
import { CatalogoDetalhePage } from './features/catalog/CatalogoDetalhePage';
import { CadastrarLivroPage } from './features/catalog/CadastrarLivroPage';
import { EditarLivroPage } from './features/catalog/EditarLivroPage';
import { AutoresPage } from './features/catalog-aux/AutoresPage';
import { EditorasPage } from './features/catalog-aux/EditorasPage';
import { CategoriasPage } from './features/catalog-aux/CategoriasPage';
import { UsuariosPage } from './features/usuarios/UsuariosPage';
import { LogsPage } from './features/auditoria/LogsPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'catalogo', element: <CatalogoListaPage /> },
          { path: 'catalogo/novo', element: <CadastrarLivroPage /> },
          { path: 'catalogo/:id', element: <CatalogoDetalhePage /> },
          { path: 'catalogo/:id/editar', element: <EditarLivroPage /> },
          { path: 'autores', element: <AutoresPage /> },
          { path: 'editoras', element: <EditorasPage /> },
          { path: 'categorias', element: <CategoriasPage /> },
          {
            path: 'usuarios',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <UsuariosPage /> }],
          },
          {
            path: 'auditoria',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <LogsPage /> }],
          },
        ],
      },
    ],
  },
]);
