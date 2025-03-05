import { useState, useCallback, useEffect, useRef } from 'react';

// Defining what this hook returns
interface NetworkConnectionHook {
  connected: boolean;         // Is the connection active?
  statusMessage: string;      // User-friendly status message
  connect: () => Promise<void>;      // Function to establish connection
  disconnect: () => Promise<void>;   // Function to close connection
  sendCommand: (command: string) => Promise<void>; // Function to send messages
}

export const useNetworkConnection = (
  // Default to localhost for development, can be overridden
  host: string = '10.42.0.47',
  port: number = 8080
): NetworkConnectionHook => {
  // State variables
  const [connected, setConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('System ready - Click "Connect" to begin');
  
  // References to maintain across renders
  const wsRef = useRef<WebSocket | null>(null);  // Store WebSocket connection
  const mountedRef = useRef(true);               // Track if component is mounted
  
  // Handle component unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;  // Prevent state updates after unmount
      
      // Close WebSocket on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Function to establish WebSocket connection
  const connect = useCallback(async () => {
    try {
      setStatusMessage('Connecting to Raspberry Pi...');
      
      // Create new WebSocket connection
      const ws = new WebSocket(`ws://${host}:${port}`);
      
      // Set up event handlers
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

  // Function to close WebSocket connection
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

  // Function to send commands through the WebSocket
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

  // Return the hook interface
  return {
    connected,
    statusMessage,
    connect,
    disconnect,
    sendCommand,
  };
};