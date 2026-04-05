import apiClient from './client';
import type { paths } from './types';

export const boardCommentsApi = {
  getComments: async (
    roomId: string,
    elementId: number,
    params?: paths['/rooms/{room_id}/board-elements/{element_id}/comments']['get']['parameters']['query']
  ) => {
    return apiClient.GET('/rooms/{room_id}/board-elements/{element_id}/comments', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
        },
        query: params,
      },
    });
  },

  createComment: async (
    roomId: string,
    elementId: number,
    body: paths['/rooms/{room_id}/board-elements/{element_id}/comments']['post']['requestBody']['content']['application/json']
  ) => {
    return apiClient.POST('/rooms/{room_id}/board-elements/{element_id}/comments', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
        },
      },
      body,
    });
  },

  updateComment: async (
    roomId: string,
    elementId: number,
    commentId: number,
    body: paths['/rooms/{room_id}/board-elements/{element_id}/comments/{comment_id}']['put']['requestBody']['content']['application/json']
  ) => {
    return apiClient.PUT('/rooms/{room_id}/board-elements/{element_id}/comments/{comment_id}', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
          comment_id: commentId,
        },
      },
      body,
    });
  },

  deleteComment: async (roomId: string, elementId: number, commentId: number) => {
    return apiClient.DELETE('/rooms/{room_id}/board-elements/{element_id}/comments/{comment_id}', {
      params: {
        path: {
          room_id: roomId,
          element_id: elementId,
          comment_id: commentId,
        },
      },
    });
  },
};

export default boardCommentsApi;
