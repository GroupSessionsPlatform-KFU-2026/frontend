import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
};

const Spinner = ({ size = 'md', className = '', text }: SpinnerProps) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <Loader2 className={`${sizeMap[size]} animate-spin text-blue-500`} />
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );
};

export default Spinner;