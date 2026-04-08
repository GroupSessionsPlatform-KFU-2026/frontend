import apiClient from './client';
import type { paths } from './types';

export const boardApi = {
  getElements: async (roomId: string) => {
    return apiClient.GET('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
    });
  },

  createElement: async (
    roomId: string,
    body: paths['/rooms/{room_id}/board-elements']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  updateElement: async (
    roomId: string,
    elementId: number,
    body: paths['/rooms/{room_id}/board-elements/{element_id}']['put']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PUT('/rooms/{room_id}/board-elements/{element_id}', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
        },
      },
      body,
    });
  },

  deleteElement: async (roomId: string, elementId: number) => {
    return apiClient.DELETE('/rooms/{room_id}/board-elements/{element_id}', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
        },
      },
    });
  },
};

export default boardApi;
