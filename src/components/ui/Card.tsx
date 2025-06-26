import React from 'react';
import { CardProps } from '../../types';

export const Card: React.FC<CardProps> = ({ children, className = '', header, footer }) => (
  <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
    {header && (
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        {header}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
    {footer && (
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        {footer}
      </div>
    )}
  </div>
);