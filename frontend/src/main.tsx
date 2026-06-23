import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { ToastContext, useToastProvider } from './hooks/useToast';
import { router } from './routes';

import './styles/fonts.css';
import './styles/colors.css';
import './styles/typography.css';
import './styles/spacing.css';
import './styles/radii.css';
import './styles/base.css';
import './styles/global.css';

function App() {
  const auth = useAuthProvider();
  const toast = useToastProvider();

  return (
    <AuthContext.Provider value={auth}>
      <ToastContext.Provider value={toast}>
        <RouterProvider router={router} />
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
