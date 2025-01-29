import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

type StatusAlertProps = {
  message: string;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ message }) => {
  return (
    <Alert className="mb-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
};

export default StatusAlert;