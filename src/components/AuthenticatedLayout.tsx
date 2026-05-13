import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    FolderKanban,
    LogOut,
    Menu,
    X,
    Home,
} from 'lucide-react';
import { useState } from 'react';

const AuthenticatedLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
        { path: '/projects', label: 'Проекты', icon: FolderKanban },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Десктопный Header */}
            <header className="bg-white border-b sticky top-0 z-20">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="text-xl font-bold text-blue-600 hover:opacity-80">
                            Studiom
                        </Link>

                        {/* Навигация — десктоп */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={isActive(item.path) ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {user && (
                            <span className="hidden sm:inline text-sm text-gray-600">
                {user.username}
              </span>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2 text-gray-500 hover:text-red-500"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Выйти</span>
                        </Button>

                        {/* Бургер-меню — мобильные */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Мобильное меню */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <nav className="container mx-auto px-4 py-2 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant={isActive(item.path) ? 'secondary' : 'ghost'}
                                        size="sm"
                                        className="w-full justify-start gap-2"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                                    <Home className="w-4 h-4" />
                                    Главная
                                </Button>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Контент */}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default AuthenticatedLayout;