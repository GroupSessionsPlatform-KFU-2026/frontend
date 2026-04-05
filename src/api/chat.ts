import apiClient from './client';
import type { paths } from './types';

export const chatApi = {
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

  updateMessage: async (
    roomId: string,
    messageId: number,
    body: paths['/rooms/{room_id}/messages/{message_id}']['put']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PUT('/rooms/{room_id}/messages/{message_id}', {
      params: {
        path: {
          room_id: roomId,
          message_id: messageId,
        },
      },
      body,
    });
  },

  deleteMessage: async (roomId: string, messageId: number) => {
    return apiClient.DELETE('/rooms/{room_id}/messages/{message_id}', {
      params: {
        path: {
          room_id: roomId,
          message_id: messageId,
        },
      },
    });
  },
};

export default chatApi;
