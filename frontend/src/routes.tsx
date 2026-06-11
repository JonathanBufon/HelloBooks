import { createBrowserRouter, Navigate } from 'react-router-dom'
import { CadastrarLivroPage } from './features/catalog/CadastrarLivroPage'
import { DetalheLivroPage } from './features/catalog/DetalheLivroPage'
import { EditarLivroPage } from './features/catalog/EditarLivroPage'
import { ListaCatalogoPage } from './features/catalog/ListaCatalogoPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/catalogo" replace />,
  },
  {
    path: '/catalogo',
    element: <ListaCatalogoPage />,
  },
  {
    path: '/catalogo/novo',
    element: <CadastrarLivroPage />,
  },
  {
    path: '/catalogo/:id',
    element: <DetalheLivroPage />,
  },
  {
    path: '/catalogo/:id/editar',
    element: <EditarLivroPage />,
  },
])
