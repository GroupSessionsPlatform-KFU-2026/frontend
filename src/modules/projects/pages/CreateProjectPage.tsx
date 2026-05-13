import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Название проекта обязательно');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await projectsApi.create({ title, description: description || undefined });
      navigate('/projects');
    } catch (err) {
      console.error('Ошибка создания проекта:', err);
      setError('Не удалось создать проект');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate('/projects')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к проектам
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Создание проекта</CardTitle>
          <CardDescription>Проект объединяет комнаты по общей теме</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название проекта *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Курсовая по React"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание (опционально)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание проекта"
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать проект'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectPage;
