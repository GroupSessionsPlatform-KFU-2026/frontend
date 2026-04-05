import apiClient from './client';
import type { paths } from './types';

export const pomodoroApi = {
  getState: async (roomId: string) => {
    return apiClient.GET('/rooms/{room_id}/pomodoro', {
      params: { path: { room_id: roomId } },
    });
  },

  updateSettings: async (
    roomId: string,
    body: paths['/rooms/{room_id}/pomodoro/settings']['patch']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PATCH('/rooms/{room_id}/pomodoro/settings', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  start: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/start', {
      params: { path: { room_id: roomId } },
    });
  },

  pause: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/pause', {
      params: { path: { room_id: roomId } },
    });
  },

  reset: async (roomId: string) => {
    return apiClient.POST('/rooms/{room_id}/pomodoro/reset', {
      params: { path: { room_id: roomId } },
    });
  },
};

export default pomodoroApi;
