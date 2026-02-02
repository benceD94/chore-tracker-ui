import { useContext } from 'react';
import { ToastContext } from './context';
import type { ToastContextContextType } from './types';

export const useToast = (): ToastContextContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
