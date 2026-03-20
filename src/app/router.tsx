import { createBrowserRouter } from 'react-router-dom';

//временные заглушки страниц
const LoginPage = () => <div>Страница входа</div>;
const RegisterPage = () => <div>Страница регистрации</div>;
const DashboardPage = () => <div>Список комнат</div>;
const CreateRoomPage = () => <div>Создание комнаты</div>;
const RoomPage = () => <div>Страница комнаты</div>;


//после добавления авторизации приватные маршруты (дэшборд, создание комнаты, комната), засунуть в приватный роут
export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
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