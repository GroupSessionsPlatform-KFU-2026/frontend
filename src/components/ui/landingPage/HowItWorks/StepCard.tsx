interface StepCard {
  number: number;
  title: string;
  description: string;
}

export const StepCard = ({ number, title, description }: StepCard) => {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-sm border">
      <div className="text-4xl font-bold text-blue-500 mb-4">{number}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};
