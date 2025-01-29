'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResetOptionsProps = {
  onButtonClick: (action: string) => void;
  disabled?: boolean;
}

const ResetOptions: React.FC<ResetOptionsProps> = ({ onButtonClick, disabled = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Options</CardTitle>
        <CardDescription>Reset system settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline"
          onClick={() => onButtonClick("Reset image settings")}
          className="w-full"
          disabled={disabled}
        >
          Reset Image Settings
        </Button>
        <Button 
          variant="outline"
          onClick={() => onButtonClick("Reset network settings")}
          className="w-full"
          disabled={disabled}
        >
          Reset Network Settings
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onButtonClick("Factory reset")}
          className="w-full"
          disabled={disabled}
        >
          Factory Reset
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResetOptions;