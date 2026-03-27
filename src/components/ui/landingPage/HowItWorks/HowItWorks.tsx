import { StepCard } from '@/components/ui/landingPage/HowItWorks/StepCard.tsx';

const steps = [
  {
    number: 1,
    title: 'Создайте комнату',
    description:
      'Пару кликов – и комната готова! Не нужно долго регистрироваться и разбираться в настройках',
  },
  {
    number: 2,
    title: 'Пригласите участников',
    description: 'Получите уникальный код или ссылку и отправьте своей команде',
  },
  {
    number: 3,
    title: 'Работайте вместе',
    description:
      'Рисуйте на доске, обсуждайте в чате, следите за таймером — всё в реальном времени!',
  },
];

export const HowItWorks = () => {
  return (
    <div id="how-it-works" className="bg-white py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-12">Как это работает?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
