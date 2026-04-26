import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Plus, FolderOpen, DoorOpen, LogIn, AlertCircle } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description?: string | null;
  created_at: string;
}

interface Room {
  id: string;
  project_id: number;
  title: string;
  room_code: string;
  created_at: string;
  status: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [projectsRes, roomsRes] = await Promise.all([
                projectsApi.getAll(),
                roomsApi.getAll(),
            ]);

            const projectsData = projectsRes?.data?.results || [];
            setProjects(projectsData);

            const roomsData = roomsRes?.data?.results || [];
            setRooms(roomsData);
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            setError('Не удалось загрузить данные');
        } finally {
            setIsLoading(false);
        }
    };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleJoinRoom = () => {
    navigate('/join');
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-[60vh]">
              <Spinner size="lg" />
          </div>
      );
  }

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-lg text-gray-600">{error}</p>
              <Button variant="outline" onClick={loadData}>
                  Попробовать снова
              </Button>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои проекты и комнаты</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleJoinRoom}>
            <LogIn className="w-4 h-4 mr-2" />
            Войти по коду
          </Button>
          <Button onClick={handleCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            Создать проект
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="projects">Проекты ({projects.length})</TabsTrigger>
          <TabsTrigger value="rooms">Комнаты ({rooms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          {projects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Нет проектов</CardTitle>
                <CardDescription>Создайте первый проект, чтобы начать работу</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать проект
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Создан: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rooms" className="mt-6">
          {rooms.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Нет комнат</CardTitle>
                <CardDescription>Создайте комнату через страницу проекта</CardDescription>
              </CardHeader>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;