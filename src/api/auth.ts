import apiClient from './client.ts';
import type { paths } from './types.ts';

export const authApi = {
  register: async (
    body: paths['/auth/register']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/auth/register', {
      body,
    });
  },

  login: async (
    body: paths['/auth/login']['post']['requestBody']['content']['application/json']
  ) => {
    const result = await apiClient.POST('/auth/login', {
      body,
    });

    if (result.data?.access_token) {
      localStorage.setItem('access_token', result.data.access_token);

      console.log('Токен получен');
    }

    return result;
  },

  setToken: (token: string) => {
    localStorage.setItem('access_token', token);
    console.log('Токен сохранён вручную');
  },

  logout: () => {
    localStorage.removeItem('access_token');
    console.log('Пользователь вышел из аккаунта');
    window.location.href = '/login';
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  getToken: () => {
    return localStorage.getItem('access_token');
  },
};

export default authApi;
