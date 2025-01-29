import { useState, useCallback, useRef } from 'react';

interface videoHook {
  isUploading: boolean;
  uploadStatus: string;
  sendVideo: (file: File) => Promise<void>;
}

export const videoUpload = (
  host: string = '10.42.0.47',
  port: number = 8081 //new websocket port for video
): videoHook => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const sendVideo = useCallback(async (file: File) => {
    try {
      // creating a new websocket
      if (!wsRef.current) {
        wsRef.current = new WebSocket(`ws://${host}:${port}/video`);
        
        wsRef.current.onopen = () => {
          setUploadStatus('Connected, starting upload...');
        };

        wsRef.current.onclose = () => {
          setUploadStatus('Upload finished');
          setIsUploading(false);
          wsRef.current = null;
        };
      }

      setIsUploading(true);
      
      // reading and sending the file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (wsRef.current && e.target?.result) {
          wsRef.current.send(e.target.result);
          setUploadStatus('Video sent to Raspberry Pi');
        }
      };
      
      reader.readAsArrayBuffer(file);

    } catch (error) {
      setUploadStatus('Error uploading video');
      setIsUploading(false);
      console.error('Upload error:', error);
    }
  }, [host, port]);

  return {
    isUploading,
    uploadStatus,
    sendVideo
  };
};