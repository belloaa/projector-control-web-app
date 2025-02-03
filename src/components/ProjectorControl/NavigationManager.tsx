import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SystemInfo from './SystemInfo';
import ResetOptions from './ResetOptions';
import Settings from './SettingsPage';
import TestPatterns from './TestPatterns';

const PageContainer = ({ children, title, onBack }: {
  children: React.ReactNode;
  title: string;
  onBack: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
};

const NavigationManager = ({ 
  currentPage, 
  onBack,
  onCommand,
  isConnected = true
}: { 
  currentPage: string | null; 
  onBack: () => void;
  onCommand: (command: string) => void;
  isConnected?: boolean;
}) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'system_info':
        return (
          <PageContainer title="System Information" onBack={onBack}>
            <SystemInfo />
          </PageContainer>
        );
      case 'settings':
        return (
          <PageContainer title="Settings" onBack={onBack}>
            <Settings />
          </PageContainer>
        );
      case 'test_pattern':
        return (
          <PageContainer title="Test Pattern" onBack={onBack}>
            <TestPatterns 
              onButtonClick={onCommand}
              disabled={!isConnected}
            />
          </PageContainer>
        );
      case 'reset_options':
        return (
          <PageContainer title="Reset Options" onBack={onBack}>
            <ResetOptions onButtonClick={onCommand} />
          </PageContainer>
        );
      default:
        return null;
    }
  };

  return renderPage();
};

export default NavigationManager;