interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">
        {icon} {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
