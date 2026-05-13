import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { LogOut, PanelRightOpen, PanelRightClose, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
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
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileTab, setMobileTab] = useState<'whiteboard' | 'participants' | 'chat'>('whiteboard');

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
            toast.error('Не удалось завершить сессию');
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
                <Spinner size="lg" text="Загрузка комнаты..." />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="bg-white border-b p-3 md:p-4 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg md:text-xl font-bold truncate">Комната: {roomId}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Кнопка сайдбара — десктоп */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden md:flex"
                        >
                            {sidebarOpen ? (
                                <PanelRightClose className="w-4 h-4" />
                            ) : (
                                <PanelRightOpen className="w-4 h-4" />
                            )}
                        </Button>
                        {isModerator && (
                            <Button variant="destructive" size="sm" onClick={handleEndRoom} disabled={isEnding}>
                                <LogOut className="w-4 h-4 mr-1 md:mr-2" />
                                <span className="hidden sm:inline">{isEnding ? 'Завершение...' : 'Завершить'}</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Десктопная раскладка */}
            <div className="flex-1 flex overflow-hidden p-2 md:p-4 gap-2 md:gap-4 hidden md:flex">
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

                {sidebarOpen && (
                    <div className="w-80 flex flex-col gap-4 overflow-hidden shrink-0">
                        <div className="shrink-0">
                            <PomodoroTimer isModerator={isModerator} />
                        </div>
                        <div className="flex-1 min-h-0">
                            <TabsPanel roomId={roomId} />
                        </div>
                    </div>
                )}
            </div>

            {/* Мобильная раскладка — табы внизу */}
            <div className="flex-1 flex flex-col overflow-hidden md:hidden">
                <div className="flex-1 overflow-hidden">
                    {mobileTab === 'whiteboard' && (
                        <ErrorBoundary
                            fallback={
                                <div className="p-4 text-red-500 bg-red-50 rounded-lg h-full flex items-center justify-center">
                                    Ошибка загрузки доски
                                </div>
                            }
                        >
                            <Whiteboard roomId={roomId} />
                        </ErrorBoundary>
                    )}
                    {mobileTab === 'participants' && (
                        <div className="h-full p-2">
                            <PomodoroTimer isModerator={isModerator} />
                        </div>
                    )}
                    {mobileTab === 'chat' && (
                        <div className="h-full p-2">
                            <TabsPanel roomId={roomId} />
                        </div>
                    )}
                </div>

                {/* Мобильная навигация */}
                <div className="flex border-t bg-white shrink-0">
                    <button
                        onClick={() => setMobileTab('whiteboard')}
                        className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
                            mobileTab === 'whiteboard' ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        <PanelRightOpen className="w-5 h-5" />
                        Доска
                    </button>
                    <button
                        onClick={() => setMobileTab('participants')}
                        className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
                            mobileTab === 'participants' ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        <Users className="w-5 h-5" />
                        Таймер
                    </button>
                    <button
                        onClick={() => setMobileTab('chat')}
                        className={`flex-1 py-3 text-xs font-medium flex flex-col items-center gap-1 ${
                            mobileTab === 'chat' ? 'text-blue-600' : 'text-gray-400'
                        }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        Чат
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomPage;