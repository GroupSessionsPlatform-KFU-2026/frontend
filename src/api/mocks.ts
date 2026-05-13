//мок данные

export const mockProjects = [
  {
    id: 1,
    title: 'Курсовая по React',
    description: 'Разработка и защита',
    created_at: '2026-03-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Хакатон 2026',
    description: 'Командная работа',
    created_at: '2026-03-20T10:00:00Z',
  },
  {
    id: 3,
    title: 'Веб-дизайн курсы',
    description: 'Создание макетов',
    created_at: '2026-03-25T10:00:00Z',
  },
];

export const mockRooms = [
  {
    id: 'room-1',
    project_id: 1,
    title: 'Обсуждение ТЗ',
    room_code: 'ABC123',
    created_at: '2026-03-16T10:00:00Z',
    status: 'active',
  },
  {
    id: 'room-2',
    project_id: 1,
    title: 'Код-ревью',
    room_code: 'DEF456',
    created_at: '2026-03-18T10:00:00Z',
    status: 'ended',
  },
  {
    id: 'room-3',
    project_id: 2,
    title: 'Мозговой штурм',
    room_code: 'GHI789',
    created_at: '2026-03-21T10:00:00Z',
    status: 'active',
  },
];

export const mockParticipants = [
  {
    id: 1,
    user_id: 1,
    user_name: 'Анна',
    role: 'owner',
    status: 'active',
    joined_at: '2026-03-16T10:00:00Z',
  },
  {
    id: 2,
    user_id: 2,
    user_name: 'Иван',
    role: 'moderator',
    status: 'active',
    joined_at: '2026-03-16T10:00:00Z',
  },
  {
    id: 3,
    user_id: 3,
    user_name: 'Пётр',
    role: 'participant',
    status: 'away',
    joined_at: '2026-03-16T10:00:00Z',
  },
  {
    id: 4,
    user_id: 4,
    user_name: 'Мария',
    role: 'participant',
    status: 'active',
    joined_at: '2026-03-16T10:00:00Z',
  },
];
