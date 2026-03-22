import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Имя</label>
            <Input placeholder="Иван Иванов" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="example@mail.ru" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Пароль</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Зарегистрироваться</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;