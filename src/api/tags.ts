import apiClient from './client';
import type { paths } from './types';

export const tagsApi = {
  getAll: async (params?: paths['/tags']['get']['parameters']['query']) => {
    return apiClient.GET('/tags', {
      params: { query: params },
    });
  },

  create: async (body: paths['/tags']['post']['requestBody']['content']['application/json']) => {
    return apiClient.POST('/tags', { body });
  },

  getById: async (tagId: number) => {
    return apiClient.GET('/tags/{tag_id}', {
      params: {
        path: {
          tag_id: tagId, // Path Parameter
        },
      },
    });
  },
};

export default tagsApi;
