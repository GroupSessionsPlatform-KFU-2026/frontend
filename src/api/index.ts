import authApi from '@/api/auth.ts';
import usersApi from '@/api/users.ts';
import projectsApi from '@/api/projects.ts';
import tagsApi from '@/api/tags.ts';
import roomsApi from '@/api/rooms.ts';
import participantsApi from '@/api/participants.ts';
import chatApi from '@/api/chat.ts';
import boardApi from '@/api/board.ts';
import boardCommentsApi from '@/api/board-comments.ts';
import pomodoroApi from '@/api/pomodoro.ts';

export type { paths } from './types';

export { default as apiClient } from './client';

export * from './auth';
export * from './users';
export * from './projects';
export * from './tags';
export * from './rooms';
export * from './participants';
export * from './chat';
export * from './board';
export * from './board-comments';
export * from './pomodoro';

export const api = {
  auth: authApi,
  users: usersApi,
  projects: projectsApi,
  tags: tagsApi,
  rooms: roomsApi,
  participants: participantsApi,
  chat: chatApi,
  board: boardApi,
  boardComments: boardCommentsApi,
  pomodoro: pomodoroApi,
} as const;
