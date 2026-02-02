import { createContext } from 'react';
import type { ToastContextContextType } from './types';

export const ToastContext = createContext<ToastContextContextType | undefined>(undefined);
