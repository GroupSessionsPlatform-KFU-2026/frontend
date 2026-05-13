import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Whiteboard from '../components/Whiteboard';
import PomodoroTimer from '../components/PomodoroTimer';
import TabsPanel from '../components/TabsPanel';

interface Participant {
  id: number;
  user_id: number;
  role: 'owner' | 'moderator' | 'participant';
}

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!roomId || !user) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await roomsApi.getParticipants(roomId);
        const participants = (response.data?.results as Participant[]) || [];

        if (participants.length === 0) {
          setIsModerator(true);
        } else {
          const currentParticipant = participants.find((p) => p.user_id === user.id);
          setIsModerator(
            currentParticipant?.role === 'moderator' || currentParticipant?.role === 'owner'
          );
        }
      } catch (error) {
        console.error('Ошибка загрузки роли:', error);
        setIsModerator(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkRole();
  }, [roomId, user]);

  const handleEndRoom = async () => {
    if (!confirm('Завершить сессию? Комната станет недоступной для всех участников.')) return;
    setIsEnding(true);
    try {
      await roomsApi.endRoom(roomId!);
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка завершения комнаты:', error);
      alert('Не удалось завершить сессию');
    } finally {
      setIsEnding(false);
    }
  };

  if (!roomId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Комната не найдена</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b p-4 shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Комната: {roomId}</h1>
          {isModerator && (
            <Button variant="destructive" size="sm" onClick={handleEndRoom} disabled={isEnding}>
              <LogOut className="w-4 h-4 mr-2" />
              {isEnding ? 'Завершение...' : 'Завершить сессию'}
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 min-w-0">
          <ErrorBoundary
            fallback={
              <div className="p-4 text-red-500 bg-red-50 rounded-lg h-full flex items-center justify-center">
                Ошибка загрузки доски
              </div>
            }
          >
            <Whiteboard roomId={roomId} />
          </ErrorBoundary>
        </div>

        <div className="w-80 flex flex-col gap-4 overflow-hidden">
          <div className="shrink-0">
            <PomodoroTimer isModerator={isModerator} />
          </div>
          <div className="flex-1 min-h-0">
            <TabsPanel roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
