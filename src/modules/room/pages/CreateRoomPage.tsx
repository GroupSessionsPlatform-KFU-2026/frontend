import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CreateRoomPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Создание комнаты</CardTitle>
          <CardDescription>Настройте параметры учебной сессии</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название комнаты</label>
            <Input placeholder="Например: Готовимся к экзамену: ТерВер" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание (опционально)</label>
            <Input placeholder="Краткое описание цели сессии" />
          </div>
          <Button className="w-full">Создать комнату</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoomPage;