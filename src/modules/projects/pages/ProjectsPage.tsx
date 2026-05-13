import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

interface Project {
    id: number;
    title: string;
    description?: string | null;
    created_at: string;
}

const ProjectsPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProjects = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await projectsApi.getAll();
            if (response && response.data) {
                setProjects(response.data.results || []);
            } else {
                setProjects([]);
            }
        } catch (err) {
            console.error('Ошибка загрузки проектов:', err);
            setError('Не удалось загрузить проекты. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = () => {
        navigate('/projects/create');
    };

    const handleProjectClick = (projectId: number) => {
        navigate(`/projects/${projectId}`);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8">
                <Spinner size="lg" text="Загрузка проектов..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-red-50 rounded-full p-4 mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Ошибка загрузки</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={loadProjects} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Повторить
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Мои проекты</h1>
                <Button onClick={handleCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать проект
                </Button>
            </div>

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
                                <CardTitle>{project.title}</CardTitle>
                                {project.description && <CardDescription>{project.description}</CardDescription>}
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
        </div>
    );
};

export default ProjectsPage;