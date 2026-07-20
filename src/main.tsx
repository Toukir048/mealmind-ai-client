import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { QueryProvider } from './components/shared/QueryProvider';
import { AuthProvider } from './contexts/AuthProvider';
import { router } from './routes/router';
import './styles.css';

const root = document.getElementById('root');
if (root === null) throw new Error('Root element was not found');

createRoot(root).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <QueryProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
