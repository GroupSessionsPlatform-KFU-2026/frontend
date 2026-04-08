import apiClient from './client';

export const usersApi = {
  getCurrent: async () => {
    return apiClient.GET('/users/me');
  },

  getById: async (userId: number) => {
    return apiClient.GET('/users/{user_id}', {
      params: {
        path: {
          user_id: userId,
        },
      },
    });
  },
};

export default usersApi;
