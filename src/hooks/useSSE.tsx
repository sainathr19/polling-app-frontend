import { useState, useEffect, useCallback, useRef } from 'react';

interface SSEOptions {
  onError?: (error: Event) => void;
  onOpen?: () => void;
  retryOnError?: boolean;
  retryInterval?: number;
}

export function useSSE<T>(url: string | null, options: SSEOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const {
    onError,
    onOpen,
    retryOnError = false,
    retryInterval = 5000,
  } = options;

  const connect = useCallback(() => {
    if (!url) return;

    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      onOpen && onOpen();
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to parse SSE data');
        console.error("Error receiving Live Updates: ", error);
      }
    };

    eventSource.onerror = (event) => {
      setIsConnected(false);
      onError && onError(event);
      eventSource.close();
    };
  }, [url, onError, onOpen, retryOnError, retryInterval]);

  const stopLive = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (url) connect();
    return () => stopLive();
  }, [url, connect, stopLive]);

  return {
    data,
    isConnected,
    setData,
    stopLive
  };
}