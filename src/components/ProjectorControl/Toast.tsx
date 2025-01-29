import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Toast = ({ 
  message, 
  duration = 3000,
  onClose
}: { 
  message: string;
  duration?: number;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
      <Alert className="bg-white/90 shadow-lg border-none">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};