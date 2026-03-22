import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мои комнаты</h1>
        <Button>+ Создать комнату</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Проектная сессия</CardTitle>
            <CardDescription>Создана: 20.03.2026</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Участников: 3</p>
            <Button variant="outline" className="mt-4 w-full">Подключиться</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Разбор задач</CardTitle>
            <CardDescription>Создана: 19.03.2026</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Участников: 5</p>
            <Button variant="outline" className="mt-4 w-full">Подключиться</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;