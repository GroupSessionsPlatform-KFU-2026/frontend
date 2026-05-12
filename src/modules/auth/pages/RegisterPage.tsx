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

    // Валидация
    const usernameError =
        touched.username && username.length < 2 ? 'Минимум 2 символа' : '';
    const emailError =
        touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            ? 'Введите корректный email'
            : '';
    const passwordError =
        touched.password && password.length < 6 ? 'Минимум 6 символов' : '';
    const confirmPasswordError =
        touched.confirmPassword && password !== confirmPassword
            ? 'Пароли не совпадают'
            : '';

    const isFormValid =
        username.length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password.length >= 6 &&
        password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ username: true, email: true, password: true, confirmPassword: true });

        if (!isFormValid) return;

        setError('');
        setIsLoading(true);

        try {
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Имя пользователя</label>
                            <Input
                                placeholder="ivan123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                                required
                            />
                            {usernameError && <p className="text-red-500 text-xs">{usernameError}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="example@mail.ru"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                                required
                            />
                            {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Пароль</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                                required
                            />
                            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Подтвердите пароль</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                                required
                            />
                            {confirmPasswordError && (
                                <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                            )}
                        </div>

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
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