import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, DoorOpen } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description?: string | null;
  created_at: string;
}

interface Room {
  id: string;
  title: string;
  room_code: string;
  created_at: string;
  status: string;
}

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      // Преобразуем id из строки в число
      const projectId = Number(id);

      setIsLoading(true);
      try {
        const [projectRes, roomsRes] = await Promise.all([
          projectsApi.getById(projectId),
          roomsApi.getAll({ project_id: projectId }),
        ]);

        // Проверяем, что проект существует
        if (projectRes && projectRes.data) {
          setProject(projectRes.data);
        } else {
          setProject(null);
        }

        // Устанавливаем комнаты (с проверкой на undefined)
        setRooms(roomsRes?.data?.results ?? []);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleCreateRoom = () => {
    navigate(`/room/create?projectId=${id}`);
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <p>Проект не найден</p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Вернуться к проектам
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к проектам
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        {project.description && <p className="text-gray-600">{project.description}</p>}
        <p className="text-sm text-gray-400 mt-2">
          Создан: {new Date(project.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Комнаты проекта</h2>
        <Button onClick={handleCreateRoom}>
          <Plus className="w-4 h-4 mr-2" />
          Создать комнату
        </Button>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Нет комнат</CardTitle>
            <CardDescription>Создайте первую комнату в этом проекте</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateRoom}>
              <Plus className="w-4 h-4 mr-2" />
              Создать комнату
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRoomClick(room.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DoorOpen className="w-5 h-5" />
                  {room.title}
                </CardTitle>
                <CardDescription>Код: {room.room_code}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Создана: {new Date(room.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Статус: {room.status === 'active' ? '🟢 Активна' : '🔴 Завершена'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
