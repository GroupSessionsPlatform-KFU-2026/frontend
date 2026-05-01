import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn } from 'lucide-react';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = roomCode.trim().toUpperCase();

    if (!trimmedCode) {
      setError('Введите код комнаты');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await roomsApi.join({ room_code: trimmedCode });
      if (response.data) {
        navigate(`/room/${response.data.room_id}`);
      } else {
        setError('Не удалось подключиться к комнате');
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage || 'Не удалось подключиться к комнате');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object' && 'response' in err) {
      const error = err as ErrorResponse;
      return error.response?.data?.message || '';
    }
    return '';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход в комнату</CardTitle>
          <CardDescription>
            Введите код приглашения, который вам отправил организатор
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Код комнаты</Label>
              <Input
                id="code"
                placeholder="Например: ABC123"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="font-mono text-lg tracking-wider"
                autoCapitalize="characters"
                required
              />
              <p className="text-xs text-gray-400">
                Код можно найти в приглашении или на странице комнаты
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? 'Подключение...' : 'Войти'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinRoomPage;
