import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailError = touched.email && !email ? 'Введите email' : '';
    const passwordError = touched.password && !password ? 'Введите пароль' : '';

    const isFormValid = email && password;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!isFormValid) return;

        setError('');
        setIsLoading(true);

        try {
            const result = await authApi.login({ email, password });

            if (result.data?.access_token) {
                const userResponse = await usersApi.getCurrent();
                const user = userResponse.data;

                if (user) {
                    localStorage.setItem('user_id', String(user.id));
                    localStorage.setItem('user_name', user.username);
                }

                navigate('/dashboard');
            } else {
                setError('Неверный email или пароль');
            }
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Ошибка при входе');
            } else {
                setError('Ошибка при входе');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Вход в Studiom</CardTitle>
                    <CardDescription>Войдите в свой аккаунт</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
                            {isLoading ? 'Вход...' : 'Войти'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Зарегистрироваться
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
