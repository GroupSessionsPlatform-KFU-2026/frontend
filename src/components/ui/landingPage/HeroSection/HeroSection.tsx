import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img
            src="https://i.pinimg.com/1200x/45/2c/22/452c2280c894f2dda60895f81e3d5f94.jpg"
            alt="Studiom illustration"
            className="rounded-lg shadow-xl w-full max-w-md"
          />
        </div>
        <div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Платформа для групповых сессий</h2>
          <p className="text-xl text-gray-600 mb-8">
            Курсовая, хакатон или мозговой штурм — собирайте команду в одном пространстве. Рисуйте
            схемы, обсуждайте идеи в чате и следите за временем с общим таймером. Никаких установок
            — просто откройте браузер и работайте.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Начать бесплатно
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
