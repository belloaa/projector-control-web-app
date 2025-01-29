import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WebSocketTester = () => {
  const [latencies, setLatencies] = useState<number[]>([]);
  const [successRate, setSuccessRate] = useState<number>(100);
  const [totalTests, setTotalTests] = useState(0);
  const [successfulTests, setSuccessfulTests] = useState(0);
  const [testing, setTesting] = useState(false);
  
  const runTest = async () => {
    const ws = new WebSocket('ws://10.42.0.47:8080');
    const startTime = performance.now();
    
    try {
      await new Promise((resolve, reject) => {
        ws.onopen = () => {
          ws.send('test_command');
          
          ws.onmessage = (event) => {
            const latency = performance.now() - startTime;
            setLatencies(prev => [...prev.slice(-20), latency]); // Keep last 20 readings
            setSuccessfulTests(prev => prev + 1);
            resolve(event);
          };
          
          ws.onerror = reject;
          setTimeout(() => reject(new Error('Timeout')), 5000);
        };
      });
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      ws.close();
      setTotalTests(prev => prev + 1);
    }
  };
  
  useEffect(() => {
    if (totalTests > 0) {
      setSuccessRate((successfulTests / totalTests) * 100);
    }
  }, [totalTests, successfulTests]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testing) {
      interval = setInterval(runTest, 1000);
    }
    return () => clearInterval(interval);
  }, [testing]);
  
  const averageLatency = latencies.length > 0 
    ? Math.round(latencies.reduce((a, b) => a + b) / latencies.length) 
    : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>WebSocket Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{averageLatency}ms</div>
            <div className="text-sm text-muted-foreground">Average Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{successRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalTests}</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </div>
        </div>
        
        <div className="text-sm space-y-1">
          <div>latencies:</div>
          {latencies.slice(-5).map((latency, i) => (
            <div key={i} className="font-mono">{latency.toFixed(1)}ms</div>
          ))}
        </div>
        
        <Button 
          onClick={() => setTesting(!testing)}
          className="w-full"
        >
          {testing ? 'Stop Testing' : 'Start Testing'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WebSocketTester;