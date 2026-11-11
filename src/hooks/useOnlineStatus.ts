import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      window.dispatchEvent(new CustomEvent('kj_network_reconnected'));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Kodular / Android WebView fallback polling:
    // Android WebViews sometimes delay or suppress DOM online/offline events.
    // Polling navigator.onLine ensures instant recovery when internet returns.
    const pollInterval = window.setInterval(() => {
      if (typeof navigator !== 'undefined') {
        const currentOnline = navigator.onLine;
        setIsOnline(prev => {
          if (prev !== currentOnline) {
            if (currentOnline) {
              window.dispatchEvent(new CustomEvent('kj_network_reconnected'));
            }
            return currentOnline;
          }
          return prev;
        });
      }
    }, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.clearInterval(pollInterval);
    };
  }, []);

  return isOnline;
}

