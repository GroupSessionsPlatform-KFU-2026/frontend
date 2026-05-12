import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
            <div className="bg-blue-50 rounded-full p-6 mb-6">
                <span className="text-6xl font-bold text-blue-500">404</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Страница не найдена</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                Запрашиваемая страница не существует или была перемещена. Проверьте адрес или вернитесь на
                главную.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.history.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                </Button>
                <Link to="/">
                    <Button>
                        <Home className="w-4 h-4 mr-2" />
                        На главную
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;