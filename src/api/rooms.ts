import apiClient from './client';
import type { paths } from './types';
import { mockRooms } from './mocks';

const USE_MOCK = true; // мок

export const roomsApi = {
  getAll: async (params?: paths['/rooms']['get']['parameters']['query']) => {
    if (USE_MOCK) {
      let filtered = [...mockRooms];
      if (params?.project_id) {
        filtered = filtered.filter((r) => r.project_id === params.project_id);
      }
      return {
        data: {
          results: filtered,
          count: filtered.length,
          page: params?.page || 1,
          page_size: params?.page_size || 10,
        },
      };
    }
    return apiClient.GET('/rooms', {
      params: { query: params },
    });
  },

  getById: async (roomId: string) => {
    if (USE_MOCK) {
      const room = mockRooms.find((r) => r.id === roomId);
      return { data: room || null };
    }
    return apiClient.GET('/rooms/{room_id}', {
      params: {
        path: { room_id: roomId },
      },
    });
  },

  create: async (body: paths['/rooms']['post']['requestBody']['content']['application/json']) => {
    if (USE_MOCK) {
      const newRoom = {
        id: `room-${Date.now()}`,
        project_id: body.project_id,
        title: body.title,
        room_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        created_at: new Date().toISOString(),
        status: 'active',
        max_participants: body.max_participants,
      };
      mockRooms.push(newRoom);
      return { data: newRoom };
    }
    return apiClient.POST('/rooms', { body });
  },

  join: async (
    body: paths['/rooms/join']['post']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      return {
        data: {
          id: Date.now(),
          room_id: 'mock-room',
          user_id: 1,
          role: 'participant',
          joined_at: new Date().toISOString(),
          is_kicked: false,
        },
      };
    }
    return apiClient.POST('/rooms/join', { body });
  },

  update: async (
    roomId: string,
    body: paths['/rooms/{room_id}']['put']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      const index = mockRooms.findIndex((r) => r.id === roomId);
      if (index !== -1) {
        mockRooms[index] = { ...mockRooms[index], ...body };
        return { data: mockRooms[index] };
      }
      throw new Error('Room not found');
    }
    return apiClient.PUT('/rooms/{room_id}', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  endRoom: async (roomId: string) => {
    if (USE_MOCK) {
      const index = mockRooms.findIndex((r) => r.id === roomId);
      if (index !== -1) {
        mockRooms[index] = { ...mockRooms[index], status: 'ended' };
        return { data: null };
      }
      throw new Error('Room not found');
    }
    return apiClient.DELETE('/rooms/{room_id}', {
      params: { path: { room_id: roomId } },
    });
  },

  getParticipants: async (
    roomId: string,
    params?: paths['/rooms/{room_id}/participants']['get']['parameters']['query']
  ) => {
    if (USE_MOCK) {
      const mockParticipants = [
        {
          id: 1,
          user_id: 1,
          user_name: 'Анна',
          role: 'owner' as const,
          joined_at: new Date().toISOString(),
          is_kicked: false,
        },
        {
          id: 2,
          user_id: 2,
          user_name: 'Иван',
          role: 'moderator' as const,
          joined_at: new Date().toISOString(),
          is_kicked: false,
        },
        {
          id: 3,
          user_id: 3,
          user_name: 'Пётр',
          role: 'participant' as const,
          joined_at: new Date().toISOString(),
          is_kicked: false,
        },
        {
          id: 4,
          user_id: 4,
          user_name: 'Мария',
          role: 'participant' as const,
          joined_at: new Date().toISOString(),
          is_kicked: false,
        },
      ];
      return {
        data: {
          results: mockParticipants,
          count: mockParticipants.length,
          page: params?.page || 1,
          page_size: params?.page_size || 10,
        },
      };
    }
    return apiClient.GET('/rooms/{room_id}/participants', {
      params: {
        path: { room_id: roomId },
        query: params,
      },
    });
  },

  removeParticipant: async (roomId: string, userId: number) => {
    if (USE_MOCK) {
      console.log('Мок: удаление участника', { roomId, userId });
      return { data: null };
    }
    return apiClient.DELETE('/rooms/{room_id}/participants/{user_id}', {
      params: {
        path: {
          room_id: roomId,
          user_id: userId,
        },
      },
    });
  },

  updateParticipantRole: async (
    roomId: string,
    userId: number,
    body: paths['/rooms/{room_id}/participants/{user_id}']['patch']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      console.log('Мок: обновление роли участника', { roomId, userId, body });
      return { data: null };
    }
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

  getMessages: async (
    roomId: string,
    params?: paths['/rooms/{room_id}/messages']['get']['parameters']['query']
  ) => {
    if (USE_MOCK) {
      return { data: { results: [], count: 0, page: 1, page_size: 10 } };
    }
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
    if (USE_MOCK) {
      return {
        data: {
          id: Date.now(),
          room_id: roomId,
          sender_id: 1,
          content: body.content,
          sent_at: new Date().toISOString(),
          is_edited: false,
        },
      };
    }
    return apiClient.POST('/rooms/{room_id}/messages', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  getBoardElements: async (roomId: string) => {
    if (USE_MOCK) {
      return { data: { results: [], count: 0, page: 1, page_size: 10 } };
    }
    return apiClient.GET('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
    });
  },

  createBoardElement: async (
    roomId: string,
    body: paths['/rooms/{room_id}/board-elements']['post']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      return {
        data: {
          id: Date.now(),
          room_id: roomId,
          author_id: 1,
          element_type: body.element_type,
          data: body.data,
          created_at: new Date().toISOString(),
          is_deleted: false,
        },
      };
    }
    return apiClient.POST('/rooms/{room_id}/board-elements', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  getPomodoro: async (roomId: string) => {
    if (USE_MOCK) {
      return { data: null };
    }
    return apiClient.GET('/rooms/{room_id}/pomodoro', {
      params: { path: { room_id: roomId } },
    });
  },

  startPomodoro: async (roomId: string) => {
    if (USE_MOCK) {
      return { data: null };
    }
    return apiClient.POST('/rooms/{room_id}/pomodoro/start', {
      params: { path: { room_id: roomId } },
    });
  },

  pausePomodoro: async (roomId: string) => {
    if (USE_MOCK) {
      return { data: null };
    }
    return apiClient.POST('/rooms/{room_id}/pomodoro/pause', {
      params: { path: { room_id: roomId } },
    });
  },

  updatePomodoroSettings: async (
    roomId: string,
    body: paths['/rooms/{room_id}/pomodoro/settings']['patch']['requestBody']['content']['application/json']
  ) => {
    if (USE_MOCK) {
      console.log('Мок: обновление настроек таймера', body);
      return { data: null };
    }
    return apiClient.PATCH('/rooms/{room_id}/pomodoro/settings', {
      params: { path: { room_id: roomId } },
      body,
    });
  },

  resetPomodoro: async (roomId: string) => {
    if (USE_MOCK) {
      return { data: null };
    }
    return apiClient.POST('/rooms/{room_id}/pomodoro/reset', {
      params: { path: { room_id: roomId } },
    });
  },
};

export default roomsApi;
