import { createBrowserRouter, Navigate } from 'react-router-dom';

import LandingPage from '@/modules/landing/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import CreateRoomPage from '@/modules/room/pages/CreateRoomPage';
import RoomPage from '@/modules/room/pages/RoomPage';

//TODO: впистаь приватные маршруты в приватный роут после реализации авторизации
export const router = createBrowserRouter([
  //публичные роуты
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
  //приватный роуты
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
]);
