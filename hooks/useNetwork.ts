import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Connection restored. You are back online.', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('Connection lost. Working in offline mode.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return { isOnline };
};