import React from 'react';
import { ButtonProps } from '../../types';
import { LoadingSpinner } from './LoadingSpinner';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-fit';
  
  const variants = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-md hover:shadow-lg',
    secondary: 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-500 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md hover:shadow-lg',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:ring-slate-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-w-[80px]',
    md: 'px-6 py-3 text-base min-w-[120px]',
    lg: 'px-8 py-4 text-lg min-w-[160px]'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};