import React from 'react';
import { InputProps } from '../../types';

export const Input: React.FC<InputProps> = ({ label, error, icon: Icon, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`
          w-full px-4 py-3 border-2 border-gray-200 rounded-xl
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          ${Icon ? 'pl-10' : ''}
          ${error ? 'border-red-300 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);