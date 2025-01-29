'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TestOptionsProps = {
  onButtonClick: (action: string) => void;
  disabled?: boolean;
}

const TestPatterns: React.FC<TestOptionsProps> = ({ onButtonClick, disabled = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Pattern</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline"
          onClick={() => onButtonClick("Checkerboard")}
          className="w-full"
          disabled={disabled}
        >
          Checkerboard
        </Button>
        <Button 
          variant="outline"
          onClick={() => onButtonClick("Option 2")}
          className="w-full"
          disabled={disabled}
        >
          Option 2
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onButtonClick("Reset")}
          className="w-full"
          disabled={disabled}
        >
          Reset
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestPatterns;