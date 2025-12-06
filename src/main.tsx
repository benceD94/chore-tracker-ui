import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import { AuthProvider } from './authentication/AuthContext';
import { AppRouter } from './AppRouter.tsx';

const root = document.getElementById("root");

createRoot(root!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </React.StrictMode>
);

