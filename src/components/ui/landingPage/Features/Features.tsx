import { FeatureItem } from './FeatureItem.tsx';

const features = [
  {
    icon: '🎨',
    title: 'Общая доска',
    description: 'Рисуйте кистью, стирайте ластиком. Все видят изменения в реальном времени',
  },
  {
    icon: '⏲️',
    title: 'Таймер Pomodoro',
    description: 'Работайте 25 минут, отдыхайте 5. Модератор управляет временем, все видят отсчет',
  },
  {
    icon: '📍',
    title: 'Маркеры',
    description: 'Анонимно оставляйте вопросы и решения на доске',
  },
];

export const Features = () => {
  return (
    <div id="features" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="pl-8 md:pl-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Все для работы в команде</h2>
            <p className="text-xl text-gray-600 mb-8">
              Сосредоточьтесь на своих задачах в комфортной для вас обстановке
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
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
  );
};
