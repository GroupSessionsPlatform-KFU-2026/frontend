import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import LandingPage from '@/modules/landing/pages/LandingPage';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import ProjectsPage from '@/modules/projects/pages/ProjectsPage';
import CreateProjectPage from '@/modules/projects/pages/CreateProjectPage';
import ProjectDetailsPage from '@/modules/projects/pages/ProjectDetailsPage';
import CreateRoomPage from '@/modules/room/pages/CreateRoomPage';
import RoomPage from '@/modules/room/pages/RoomPage';
import JoinRoomPage from '@/modules/room/pages/JoinRoomPage';

export const router = createBrowserRouter([
  //паблик роуты
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  //приватные роуты(требуют авторизации)
  //{
  //element: <ProtectedRoute />,
  //children: [
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/projects/create', element: <CreateProjectPage /> },
  { path: '/projects/:id', element: <ProjectDetailsPage /> },
  { path: '/room/create', element: <CreateRoomPage /> },
  { path: '/room/:roomId', element: <RoomPage /> },
  { path: '/join', element: <JoinRoomPage /> },
  //],
  //},

  //404
  { path: '*', element: <Navigate to="/" replace /> },
]);
