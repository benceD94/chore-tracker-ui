import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react';
import { AuthProvider } from './authentication/AuthContext';
import { AppRouter } from './AppRouter.tsx';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const root = document.getElementById("root");
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
  spacing: 8,
});

createRoot(root!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

