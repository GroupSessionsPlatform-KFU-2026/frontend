import apiClient from './client';
import type { paths } from './types';

export const participantsApi = {
  getAll: async (
    roomId: string,
    params?: paths['/rooms/{room_id}/participants']['get']['parameters']['query']
  ) => {
    return apiClient.GET('/rooms/{room_id}/participants', {
      params: {
        path: { room_id: roomId },
        query: params,
      },
    });
  },

  update: async (
    roomId: string,
    userId: number,
    body: paths['/rooms/{room_id}/participants/{user_id}']['patch']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PATCH('/rooms/{room_id}/participants/{user_id}', {
      params: {
        path: {
          room_id: roomId,
          user_id: userId,
        },
      },
      body,
    });
  },

  remove: async (roomId: string, userId: number) => {
    return apiClient.DELETE('/rooms/{room_id}/participants/{user_id}', {
      params: {
        path: {
          room_id: roomId,
          user_id: userId,
        },
      },
    });
  },
};

export default participantsApi;
