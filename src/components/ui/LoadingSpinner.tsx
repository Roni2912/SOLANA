import React from 'react';
import { LoadingSpinnerProps } from '../../types';

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
  );
};