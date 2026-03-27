import { Link } from 'react-router-dom';
import { scrollToSection } from '@/components/utils/scrollToSection.ts';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">Studiom</h3>
            <p className="text-gray-400 mb-4">Ваша виртуальная платформа для групповых сессий</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                FB
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                TW
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                IG
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">О чем</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/login" className="hover:text-white">
                  Вход
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-white"
                >
                  Как это работает
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('features')} className="hover:text-white">
                  Функционал платформы
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Медиа</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Помощь</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Поддержка
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2026 Studiom. Все права защищены</p>
        </div>
      </div>
    </footer>
  );
};
