import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/modules/landing/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import CreateRoomPage from '@/modules/room/pages/CreateRoomPage';
import RoomPage from '@/modules/room/pages/RoomPage';

export const router = createBrowserRouter([
  //паблик роуты
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  //приватные роуты
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/room/create',
        element: <CreateRoomPage />,
      },
      {
        path: '/room/:roomId',
        element: <RoomPage />,
      },
    ],
  },

  //роут не найден
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
