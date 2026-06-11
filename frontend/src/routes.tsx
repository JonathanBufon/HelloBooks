import { createBrowserRouter, Navigate } from 'react-router-dom'
import { CadastrarLivroPage } from './features/catalog/CadastrarLivroPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/catalogo/novo" replace />,
  },
  {
    path: '/catalogo/novo',
    element: <CadastrarLivroPage />,
  },
])
