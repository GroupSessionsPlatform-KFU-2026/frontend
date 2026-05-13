import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';

interface Project {
    id: number;
    title: string;
}

const CreateRoomPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [maxParticipants, setMaxParticipants] = useState(6);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdRoom, setCreatedRoom] = useState<{ id: string; code: string } | null>(null);
    const [searchParams] = useSearchParams();
    const projectIdFromUrl = searchParams.get('projectId');

    useEffect(() => {
        const loadProjects = async () => {
            setIsLoadingProjects(true);
            try {
                const response = await projectsApi.getAll();
                const projectsData = response?.data?.results || [];
                setProjects(projectsData);

                // Если projectId передан в URL, выбираем его
                if (projectIdFromUrl) {
                    const preselectedId = Number(projectIdFromUrl);
                    const exists = projectsData.some((p: Project) => p.id === preselectedId);
                    if (exists) {
                        setSelectedProjectId(preselectedId);
                    } else if (projectsData.length > 0) {
                        setSelectedProjectId(projectsData[0].id);
                    }
                } else if (projectsData.length > 0) {
                    setSelectedProjectId(projectsData[0].id);
                }
            } catch (err) {
                console.error('Ошибка загрузки проектов:', err);
                toast.error('Не удалось загрузить список проектов');
            } finally {
                setIsLoadingProjects(false);
            }
        };
        loadProjects();
    }, [projectIdFromUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId) {
            setError('Выберите проект');
            return;
        }

        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const mockRoom = {
                id: `room-${Date.now()}`,
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            };
            setCreatedRoom(mockRoom);
            setIsLoading(false);
        }, 500);
    };

    if (createdRoom) {
        const inviteLink = `${window.location.origin}/room/${createdRoom.id}`;
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Комната создана! 🎉</CardTitle>
                        <CardDescription>Пригласите участников по ссылке или коду</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Ссылка для приглашения</Label>
                            <div className="p-3 bg-gray-100 rounded-lg break-all">
                                <code className="text-sm">{inviteLink}</code>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    navigator.clipboard.writeText(inviteLink);
                                    toast.success('Ссылка скопирована!');
                                }}
                            >
                                Скопировать ссылку
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Код комнаты</Label>
                            <div className="p-3 bg-gray-100 rounded-lg text-center">
                                <code className="text-lg font-bold">{createdRoom.code}</code>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    navigator.clipboard.writeText(createdRoom.code);
                                    toast.success('Код скопирован!');
                                }}
                            >
                                Скопировать код
                            </Button>
                        </div>

                        <Button className="w-full" onClick={() => navigate(`/room/${createdRoom.id}`)}>
                            Перейти в комнату
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoadingProjects) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-lg">
                    <CardContent className="pt-6">
                        <Spinner size="md" text="Загрузка проектов..." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Нет проектов</CardTitle>
                        <CardDescription>
                            Сначала создайте проект, чтобы добавить в него комнату
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/dashboard')} className="w-full">
                            Вернуться на главную
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Создание комнаты</CardTitle>
                    <CardDescription>Настройте параметры учебной сессии</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project">Проект</Label>
                            <Select
                                value={selectedProjectId?.toString()}
                                onValueChange={(value: string | null) => {
                                    if (value) setSelectedProjectId(Number(value));
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите проект" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Название комнаты</Label>
                            <Input
                                id="title"
                                placeholder="Например: Готовимся к экзамену"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants">Максимум участников</Label>
                            <Input
                                id="maxParticipants"
                                type="number"
                                min={1}
                                max={100}
                                value={maxParticipants}
                                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                                required
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Создание...' : 'Создать комнату'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateRoomPage;