import { useEffect, useState } from 'react';
import { roomsApi } from '@/api/rooms';
import { usersApi } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Users, Crown, Shield, User, MoreVertical, X, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Participant {
  id: number;
  room_id: string;
  user_id: number;
  role: 'owner' | 'moderator' | 'participant';
  joined_at: string;
  left_at?: string | null;
  is_kicked: boolean;
}

interface ParticipantsProps {
  roomId: string;
  currentUserId?: number;
  isModerator?: boolean;
}

interface ParticipantWithName extends Participant {
  user_name: string;
}

// мок-данные
const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 1,
    room_id: 'mock-room',
    user_id: 1,
    role: 'owner',
    joined_at: new Date().toISOString(),
    is_kicked: false,
  },
  {
    id: 2,
    room_id: 'mock-room',
    user_id: 2,
    role: 'moderator',
    joined_at: new Date().toISOString(),
    is_kicked: false,
  },
  {
    id: 3,
    room_id: 'mock-room',
    user_id: 3,
    role: 'participant',
    joined_at: new Date().toISOString(),
    is_kicked: false,
  },
  {
    id: 4,
    room_id: 'mock-room',
    user_id: 4,
    role: 'participant',
    joined_at: new Date().toISOString(),
    is_kicked: false,
  },
];

const MOCK_NAMES: Record<number, string> = {
  1: 'Анна',
  2: 'Иван',
  3: 'Пётр',
  4: 'Мария',
};

const Participants = ({ roomId, currentUserId = 1, isModerator = true }: ParticipantsProps) => {
  const [participants, setParticipants] = useState<ParticipantWithName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Состояния для диалогов подтверждения
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [demoteDialogOpen, setDemoteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  const fetchUserName = async (userId: number): Promise<string> => {
    //апи-вызов
    /*
    try {
      const response = await usersApi.getById(userId);
      return response.data?.username || `Пользователь ${userId}`;
    } catch (error) {
      console.error(`Ошибка загрузки имени пользователя ${userId}:`, error);
      return `Пользователь ${userId}`;
    }
    */
    return MOCK_NAMES[userId] || `Пользователь ${userId}`;
  };

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      //апи-вызов
      /*
      const response = await roomsApi.getParticipants(roomId);
      const rawParticipants = response.data?.results || [];
      const participantsWithNames = await Promise.all(
        rawParticipants.map(async (p: Participant) => ({
          ...p,
          user_name: await fetchUserName(p.user_id),
        }))
      );
      setParticipants(participantsWithNames);
      */
      const participantsWithNames = await Promise.all(
        MOCK_PARTICIPANTS.map(async (p) => ({
          ...p,
          user_name: await fetchUserName(p.user_id),
        }))
      );
      setParticipants(participantsWithNames);
    } catch (error) {
      console.error('Ошибка загрузки участников:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [roomId]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Создатель';
      case 'moderator':
        return 'Модератор';
      default:
        return 'Участник';
    }
  };

  const handlePromoteClick = (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setPromoteDialogOpen(true);
  };

  const handleDemoteClick = (userId: number, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setDemoteDialogOpen(true);
  };

  const confirmPromote = async () => {
    if (!selectedUserId) return;
    //апи-вызов
    /*
    try {
      await roomsApi.updateParticipantRole(roomId, selectedUserId, { role: 'moderator' });
      setParticipants((prev) =>
        prev.map((p) =>
          p.user_id === selectedUserId ? { ...p, role: 'moderator' } : p
        )
      );
    } catch (error) {
      console.error('Ошибка назначения модератора:', error);
      alert('Не удалось назначить модератора');
    }
    */
    // мок
    console.log('Назначить модератором:', selectedUserId);
    setParticipants((prev) =>
      prev.map((p) => (p.user_id === selectedUserId ? { ...p, role: 'moderator' } : p))
    );
    setPromoteDialogOpen(false);
    setSelectedUserId(null);
  };

  const confirmDemote = async () => {
    if (!selectedUserId) return;
    // апи-вызов
    /*
    try {
      await roomsApi.updateParticipantRole(roomId, selectedUserId, { role: 'participant' });
      setParticipants((prev) =>
        prev.map((p) =>
          p.user_id === selectedUserId ? { ...p, role: 'participant' } : p
        )
      );
    } catch (error) {
      console.error('Ошибка снятия модератора:', error);
      alert('Не удалось снять модератора');
    }
    */
    // мок
    console.log('Снять модератора:', selectedUserId);
    setParticipants((prev) =>
      prev.map((p) => (p.user_id === selectedUserId ? { ...p, role: 'participant' } : p))
    );
    setDemoteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleRemove = async (userId: number) => {
    if (!confirm('Удалить участника из комнаты?')) return;
    // апи-вызов
    /*
    try {
      await roomsApi.removeParticipant(roomId, userId);
      setParticipants((prev) => prev.filter((p) => p.user_id !== userId));
    } catch (error) {
      console.error('Ошибка удаления участника:', error);
      alert('Не удалось удалить участника');
    }
    */
    console.log('Удалить участника:', userId);
    setParticipants((prev) => prev.filter((p) => p.user_id !== userId));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-4 text-center text-gray-400 text-sm">
        Загрузка участников...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b flex items-center gap-2">
        <Users className="w-4 h-4" />
        <h3 className="font-semibold">Участники ({participants.length})</h3>
      </div>

      <div className="divide-y max-h-64 overflow-y-auto">
        {participants.map((p) => (
          <div key={p.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-1">
                  {getRoleIcon(p.role)}
                  <span className="text-sm font-medium">{p.user_name}</span>
                </div>
                <div className="text-xs text-gray-400">{getRoleLabel(p.role)}</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* кнопка назначения модератора */}
              {isModerator && p.role === 'participant' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePromoteClick(p.user_id, p.user_name)}
                  title="Назначить модератором"
                  className="h-8 w-8 p-0"
                >
                  <Shield className="w-4 h-4 text-blue-500" />
                </Button>
              )}

              {/* кнопка снятия модератора */}
              {isModerator && p.role === 'moderator' && p.user_id !== currentUserId && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDemoteClick(p.user_id, p.user_name)}
                  title="Снять модератора"
                  className="h-8 w-8 p-0"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                </Button>
              )}

              {/* кнопка удаления */}
              {isModerator && p.role !== 'owner' && p.user_id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRemove(p.user_id)}
                      className="text-red-600"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* диалог подтверждения */}
      <AlertDialog open={promoteDialogOpen} onOpenChange={setPromoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Назначить модератора?</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь <span className="font-semibold">{selectedUserName}</span> получит права
              модератора: сможет удалять участников и назначать других модераторов.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPromote}>Назначить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* диалог подтверждения */}
      <AlertDialog open={demoteDialogOpen} onOpenChange={setDemoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Снять модератора?</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь <span className="font-semibold">{selectedUserName}</span> потеряет права
              модератора.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDemote}>Снять</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Participants;
