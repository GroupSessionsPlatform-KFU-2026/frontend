import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './src/context/AuthContext';
import { router } from './src/router';
import ErrorBoundary from './src/components/ErrorBoundary';
import './src/index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <RouterProvider router={router} />
                <Toaster position="top-right" richColors closeButton />
            </AuthProvider>
        </ErrorBoundary>
    </StrictMode>
);