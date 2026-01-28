import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  className?: string;
}

export const CircularProgressAnimated: React.FC<CircularProgressProps> = ({ 
  progress, 
  size = 120, 
  className = "" 
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          className="text-blue-500 transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

interface StepProgressProps {
  steps: Array<{
    title: string;
    completed: boolean;
    current?: boolean;
  }>;
  className?: string;
}

export const StepProgressVertical: React.FC<StepProgressProps> = ({ 
  steps, 
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step.completed 
              ? 'bg-green-500 text-white' 
              : step.current 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
          }`}>
            {step.completed ? '✓' : index + 1}
          </div>
          <div className={`text-sm ${
            step.completed ? 'text-green-600' : step.current ? 'text-blue-600' : 'text-gray-500'
          }`}>
            {step.title}
          </div>
        </div>
      ))}
    </div>
  );
};
