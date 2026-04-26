import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!authApi.isLoggedIn()) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await usersApi.getCurrent();
        const userData = response.data;
        if (userData) {
          setUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
          });
        }
      } catch (error) {
        console.error('Failed to load user', error);
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    authApi.logout(); //очистка localStorage и редирект
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//кастомхук для использования контекста
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
