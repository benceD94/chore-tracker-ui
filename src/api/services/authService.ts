import { api } from '../client';
import type { AuthResponseDto, LoginDto } from '../types';

export const authService = {
  login: (idToken: string): Promise<AuthResponseDto> => {
    return api.post<AuthResponseDto>('/auth/login', { idToken } as LoginDto);
  },

  logout: (): Promise<void> => {
    return api.post<void>('/auth/logout');
  },

  getCurrentUser: (): Promise<AuthResponseDto> => {
    return api.get<AuthResponseDto>('/auth/me');
  },
};
