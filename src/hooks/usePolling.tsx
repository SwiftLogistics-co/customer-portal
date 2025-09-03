import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UsePollingOptions {
  queryKey: string[];
  pollingInterval?: number;
  enabled?: boolean;
}

export const usePolling = ({ queryKey, pollingInterval = 5000, enabled = true }: UsePollingOptions) => {
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = () => {
    if (!enabled || intervalRef.current) return;
    
    setIsPolling(true);
    intervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
    }, pollingInterval);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [enabled, pollingInterval]);

  // Stop polling when component unmounts
  useEffect(() => {
    return () => stopPolling();
  }, []);

  return { isPolling, startPolling, stopPolling };
};

// Settings for configurable polling interval
export const usePollingSettings = () => {
  const [pollingInterval, setPollingInterval] = useState(() => {
    const saved = localStorage.getItem('pollingInterval');
    return saved ? parseInt(saved) : 5000;
  });

  const updateInterval = (interval: number) => {
    setPollingInterval(interval);
    localStorage.setItem('pollingInterval', interval.toString());
  };

  return { pollingInterval, updateInterval };
};