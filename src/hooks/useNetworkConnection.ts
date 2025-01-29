import { useState, useCallback, useEffect, useRef } from 'react';

interface NetworkConnectionHook {
  connected: boolean;
  statusMessage: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
}

export const useNetworkConnection = (
  host: string = '10.42.0.47',
  port: number = 8080
): NetworkConnectionHook => {
  const [connected, setConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('System ready - Click "Connect" to begin');
  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(true);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const connect = useCallback(async () => {
    try {
      setStatusMessage('Connecting to Raspberry Pi...');
      
      // create WebSocket connection
      const ws = new WebSocket(`ws://${host}:${port}`);
      
      ws.onopen = () => {
        if (mountedRef.current) {
          setConnected(true);
          setStatusMessage('Connected to Raspberry Pi');
          wsRef.current = ws;
        }
      };

      ws.onmessage = (event) => {
        if (mountedRef.current) {
          console.log('Received:', event.data);
          setStatusMessage(`Device message: ${event.data}`);
        }
      };

      ws.onerror = (error) => {
        if (mountedRef.current) {
          console.error('WebSocket error:', error);
          setStatusMessage('Connection error - Please check if the Raspberry Pi server is running');
          setConnected(false);
        }
      };

      ws.onclose = () => {
        if (mountedRef.current) {
          setConnected(false);
          setStatusMessage('Disconnected from Raspberry Pi');
          wsRef.current = null;
        }
      };
    } catch (error) {
      console.error('Connection error:', error);
      if (mountedRef.current) {
        setStatusMessage(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setConnected(false);
      }
    }
  }, [host, port]);

  const disconnect = useCallback(async () => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
        if (mountedRef.current) {
          setConnected(false);
          setStatusMessage('Disconnected from Raspberry Pi');
        }
      } catch (error) {
        console.error('Disconnect error:', error);
        if (mountedRef.current) {
          setStatusMessage(`Disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      wsRef.current = null;
    }
  }, []);

  const sendCommand = useCallback(async (command: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setStatusMessage('No connection to Raspberry Pi. Please connect first.');
      throw new Error('No connection to Raspberry Pi');
    }

    try {
      wsRef.current.send(command);
      if (mountedRef.current) {
        setStatusMessage(`Command sent: ${command}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      if (mountedRef.current) {
        setStatusMessage(`Send error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      throw error;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    connected,
    statusMessage,
    connect,
    disconnect,
    sendCommand,
  };
};