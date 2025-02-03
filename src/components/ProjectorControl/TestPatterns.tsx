'use client'

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TestPatternsProps = {
  onButtonClick: (pattern: string) => void;
  disabled?: boolean;
}

const TestPatterns: React.FC<TestPatternsProps> = ({ onButtonClick, disabled = false }) => {
  const patterns = [
    { name: "BLACK", label: "Solid Black" },
    { name: "WHITE", label: "Solid White" },
    { name: "RED", label: "Solid Red" },
    { name: "GREEN", label: "Solid Green" },
    { name: "BLUE", label: "Solid Blue" },
    { name: "VERTICAL_LINES", label: "Vertical Lines" },
    { name: "HORIZONTAL_LINES", label: "Horizontal Lines" },
    { name: "CHECKERBOARD", label: "Checkerboard" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Patterns</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {patterns.map((pattern) => (
          <Button 
            key={pattern.name}
            variant="outline"
            onClick={() => onButtonClick(`pattern ${pattern.name}`)}
            className="w-full"
            disabled={disabled}
          >
            {pattern.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default TestPatterns;