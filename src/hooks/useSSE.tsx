import { useState, useEffect, useCallback } from 'react';

interface SSEOptions {
  onError?: (error: Event) => void;
  onOpen?: () => void;
  retryOnError?: boolean;
  retryInterval?: number;
}

export function useSSE<T>(url: string | null, options: SSEOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const {
    onError,
    onOpen,
    retryOnError = true,
    retryInterval = 5000,
  } = options;

  const connect = useCallback(() => {
    if (!url) return null;

    const eventSource = new EventSource(url);
    
    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to parse SSE data');
        console.log("Error receiving Live Updates : ",err);
      }
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      const error = new Error('SSE connection error');
      eventSource.close();
      if (retryOnError) {
        setTimeout(() => connect(), retryInterval);
      }
    };

    return eventSource;
  }, [url, onError, onOpen, retryOnError, retryInterval]);

  useEffect(() => {
    const eventSource = connect();
    return () => {
      eventSource?.close();
    };
  }, []);

  return {
    data,
    isConnected,
    setData
  };
}