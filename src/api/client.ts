import createClient from 'openapi-fetch';
import type { paths } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
});

apiClient.use({
  onRequest: ({ request }) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  },

  onResponse: async ({ response }) => {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return response;
  },
});

export default apiClient;
