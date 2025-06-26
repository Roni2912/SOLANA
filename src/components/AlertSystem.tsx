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
    <div className="fixed top-4 right-4 z-50 space-y-2 animate-in slide-in-from-right duration-300">
      {state.error && (
        <Alert
          type="error"
          message={state.error}
          onClose={() => dispatch({ type: 'SET_ERROR', payload: '' })}
          className="max-w-sm shadow-lg"
        />
      )}
      {state.success && (
        <Alert
          type="success"
          message={state.success}
          onClose={() => dispatch({ type: 'SET_SUCCESS', payload: '' })}
          className="max-w-sm shadow-lg"
        />
      )}
    </div>
  );
};