import React, { useEffect } from 'react';
import { useApp } from '../contexts';
import { Alert } from './ui';

export const AlertSystem: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success, dispatch]);

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ERROR', payload: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, dispatch]);

  if (!state.error && !state.success) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 space-y-3 animate-slide-in-bottom px-4 w-full max-w-md">
      {state.error && (
        <Alert
          type="error"
          message={state.error}
          onClose={() => dispatch({ type: 'SET_ERROR', payload: '' })}
          className="w-full shadow-2xl border-2"
        />
      )}
      {state.success && (
        <Alert
          type="success"
          message={state.success}
          onClose={() => dispatch({ type: 'SET_SUCCESS', payload: '' })}
          className="w-full shadow-2xl border-2"
        />
      )}
    </div>
  );
};