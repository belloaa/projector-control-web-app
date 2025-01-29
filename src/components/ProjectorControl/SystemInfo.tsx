import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Information</CardTitle>
        <CardDescription>View system status and details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Firmware Version: v1.0.0</p>
          <p className="text-sm font-medium">System Status: Online</p>
          <p className="text-sm font-medium">Temperature: 45°C</p>
          <p className="text-sm font-medium">Operating Time: 2h 15m</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfo;