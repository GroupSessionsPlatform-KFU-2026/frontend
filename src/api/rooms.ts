import apiClient from './client';
import type { paths } from './types';

export const roomsApi = {
  getAll: async (params?: paths['/rooms']['get']['parameters']['query']) => {
    return apiClient.GET('/rooms', {
      params: { query: params },
    });
  },

  create: async (body: paths['/rooms']['post']['requestBody']['content']['application/json']) => {
    return apiClient.POST('/rooms', { body });
  },

  join: async (
    body: paths['/rooms/join']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/rooms/join', { body });
  },

  getById: async (roomId: string) => {
    return apiClient.GET('/rooms/{room_id}', {
      params: {
        path: { room_id: roomId },
      },
    });
  },

  update: async (
    roomId: string,
    body: paths['/rooms/{room_id}']['put']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PUT('/rooms/{room_id}', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  endRoom: async (roomId: string) => {
    return apiClient.DELETE('/rooms/{room_id}', {
      params: { path: { room_id: roomId } },
    });
  },

  getParticipants: async (
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

  getMessages: async (
    roomId: string,
    params?: paths['/rooms/{room_id}/messages']['get']['parameters']['query']
  ) => {
    return apiClient.GET('/rooms/{room_id}/messages', {
      params: {
        path: { room_id: roomId },
        query: params,
      },
    });
  },

  sendMessage: async (
    roomId: string,
    body: paths['/rooms/{room_id}/messages']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/rooms/{room_id}/messages', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  getBoardElements: async (roomId: string) => {
    return apiClient.GET('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
    });
  },

  createBoardElement: async (
    roomId: string,
    body: paths['/rooms/{room_id}/board-elements']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  getPomodoro: async (roomId: string) => {
    return apiClient.GET('/rooms/{room_id}/pomodoro', {
      params: { path: { room_id: roomId } },
    });
  },

  startPomodoro: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/start', {
      params: { path: { room_id: roomId } },
    });
  },

  pausePomodoro: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/pause', {
      params: { path: { room_id: roomId } },
    });
  },

  resetPomodoro: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/reset', {
      params: { path: { room_id: roomId } },
    });
  },
};

export default roomsApi;
