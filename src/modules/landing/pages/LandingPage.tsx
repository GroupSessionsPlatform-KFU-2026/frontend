import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // функция для плавного скролла к секции
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* шапка */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Studiom</h1>
          <div className="space-x-4">
            <Link to="/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link to="/register">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* основная часть */}
      <main>
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
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Платформа для групповых сессий
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Курсовая, хакатон или мозговой штурм — собирайте команду в одном пространстве.
                Рисуйте схемы, обсуждайте идеи в чате и следите за временем с общим таймером.
                Никаких установок — просто откройте браузер и работайте.
              </p>
              <Link to="/register">
                <Button size="lg" className="text-lg px-8">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* как это работает */}
        <div id="how-it-works" className="bg-white py-24 scroll-mt-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Как это работает?</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm border">
                <div className="text-4xl font-bold text-blue-500 mb-4">1</div>
                <h4 className="text-xl font-semibold mb-2">Создайте комнату</h4>
                <p className="text-gray-500">
                  Пару кликов – и комната готова! Не нужно долго регистрироваться и разбираться в настройках
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm border">
                <div className="text-4xl font-bold text-blue-500 mb-4">2</div>
                <h4 className="text-xl font-semibold mb-2">Пригласите участников</h4>
                <p className="text-gray-500">
                  Получите уникальный код или ссылку и отправьте своей команде
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm border">
                <div className="text-4xl font-bold text-blue-500 mb-4">3</div>
                <h4 className="text-xl font-semibold mb-2">Работайте вместе</h4>
                <p className="text-gray-500">
                  Рисуйте на доске, обсуждайте в чате, следите за таймером — всё в реальном времени!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* все для работы в команде */}
        <div id="features" className="py-24 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="pl-8 md:pl-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Все для работы в команде
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Сосредоточьтесь на своих задачах в комфортной для вас обстановке
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">🎨 Общая доска</h3>
                    <p className="text-gray-600">
                      Рисуйте кистью, стирайте ластиком. Все видят изменения в реальном времени
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">⏲️ Таймер Pomodoro</h3>
                    <p className="text-gray-600">
                      Работайте 25 минут, отдыхайте 5. Модератор управляет временем, все видят отсчет
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">📍 Маркеры</h3>
                    <p className="text-gray-600">
                      Анонимно оставляйте вопросы и решения на доске
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img 
                  src="https://i.pinimg.com/736x/34/25/c6/3425c627ec834be454e4a59e5ec4d2ea.jpg"
                  alt="Team work illustration"
                  className="rounded-lg shadow-xl w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* футер */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Studiom</h3>
              <p className="text-gray-400 mb-4">Ваша виртуальная платформа для групповых сессий</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">FB</a>
                <a href="#" className="text-gray-400 hover:text-white">TW</a>
                <a href="#" className="text-gray-400 hover:text-white">IG</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">О чем</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Вход</Link></li>
                <li>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-white"
                  >
                    Как это работает
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="hover:text-white"
                  >
                    Функционал платформы
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Медиа</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Помощь</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Поддержка</a></li>
                <li><a href="#" className="hover:text-white">Политика конфиденциальности</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 Studiom. Все права защищены</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;