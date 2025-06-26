import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { AlertProps } from '../../types';

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose, className = '' }) => {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`${types[type]} border rounded-xl p-4 flex items-center gap-3 ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};