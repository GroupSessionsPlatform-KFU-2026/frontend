import { registerSchema } from '@/lib/validation/forms';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validation = registerSchema.safeParse({ username, email, password, confirmPassword });
  const fieldErrors = validation.success ? {} : z.flattenError(validation.error).fieldErrors;
  const usernameError = touched.username ? fieldErrors.username?.[0] : '';
  const emailError = touched.email ? fieldErrors.email?.[0] : '';
  const passwordError = touched.password ? fieldErrors.password?.[0] : '';
  const confirmPasswordError = touched.confirmPassword ? fieldErrors.confirmPassword?.[0] : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true, confirmPassword: true });

    if (!validation.success) return;

    setError('');
    setIsLoading(true);

    try {
      const { username, email, password } = validation.data;
      await authApi.register({ username, email, password });
      toast.success('Регистрация успешна! Теперь войдите в систему.');
      navigate('/login');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Ошибка регистрации');
      } else {
        setError('Ошибка регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
          <CardDescription>Создайте новый аккаунт</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Имя пользователя
              </label>
              <Input
                id="username"
                aria-invalid={Boolean(usernameError)}
                aria-describedby={usernameError ? 'username-error' : undefined}
                placeholder="ivan123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                required
              />
              {usernameError && (
                <p id="username-error" role="alert" className="text-red-500 text-xs">
                  {usernameError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'email-error' : undefined}
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                required
              />
              {emailError && (
                <p id="email-error" role="alert" className="text-red-500 text-xs">
                  {emailError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'password-error' : undefined}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                required
              />
              {passwordError && (
                <p id="password-error" role="alert" className="text-red-500 text-xs">
                  {passwordError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Подтвердите пароль
              </label>
              <Input
                id="confirmPassword"
                aria-invalid={Boolean(confirmPasswordError)}
                aria-describedby={confirmPasswordError ? 'confirmPassword-error' : undefined}
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                required
              />
              {confirmPasswordError && (
                <p id="confirmPassword-error" role="alert" className="text-red-500 text-xs">
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
