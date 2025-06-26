import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { AlertProps } from '../../types';

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    success: 'bg-green-100 border-green-300 text-green-900 shadow-green-200',
    error: 'bg-red-100 border-red-300 text-red-900 shadow-red-200',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-900 shadow-yellow-200',
    info: 'bg-blue-100 border-blue-300 text-blue-900 shadow-blue-200'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`${types[type]} border rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};