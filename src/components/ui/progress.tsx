import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100, className, ...props }) => {
  return (
    <div className={`relative w-full h-2 bg-gray-200 rounded ${className || ''}`} {...props}>
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 rounded"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
};

export default Progress;
