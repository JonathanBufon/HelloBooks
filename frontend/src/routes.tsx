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
import { MultasPage } from './features/multas/MultasPage';
import { MinhasMultasPage } from './features/minhas-multas/MinhasMultasPage';
import { MinhasSolicitacoesEmprestimoPage } from './features/solicitacoes/MinhasSolicitacoesEmprestimoPage';
import { SolicitacoesEmprestimoPage } from './features/solicitacoes/SolicitacoesEmprestimoPage';

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
          {
            path: 'catalogo/novo',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <CadastrarLivroPage /> }],
          },
          { path: 'catalogo/:id', element: <CatalogoDetalhePage /> },
          {
            path: 'catalogo/:id/editar',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <EditarLivroPage /> }],
          },
          {
            path: 'autores',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <AutoresPage /> }],
          },
          {
            path: 'editoras',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <EditorasPage /> }],
          },
          {
            path: 'categorias',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <CategoriasPage /> }],
          },
          {
            path: 'usuarios',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <UsuariosPage /> }],
          },
          {
            path: 'multas',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <MultasPage /> }],
          },
          {
            path: 'solicitacoes-emprestimo',
            element: <ProtectedRoute allowedRoles={['bibliotecario']} />,
            children: [{ index: true, element: <SolicitacoesEmprestimoPage /> }],
          },
          { path: 'minhas-multas', element: <MinhasMultasPage /> },
          { path: 'minhas-solicitacoes', element: <MinhasSolicitacoesEmprestimoPage /> },
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
