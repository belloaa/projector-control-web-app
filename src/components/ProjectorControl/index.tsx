import React, { useState, useEffect } from 'react';
import { useNetworkConnection } from '@/hooks/useNetworkConnection';
import { useVideoUpload } from '@/hooks/videoUpload';
import { Card } from "@/components/ui/card";
import { Power, Settings, RefreshCcw, Files, Monitor, Grid, Network } from 'lucide-react';
import { Toast } from './Toast';
import ImageControls from './ImageControls';
import NavigationManager from './NavigationManager';

// Constants for page names 
const PAGES = {
  SYSTEM_INFO: 'system_info',
  SETTINGS: 'settings',
  TEST_PATTERN: 'test_pattern',
  RESET_OPTIONS: 'reset_options',
};

// Definitions of the structure of the props
type ControlCardProps = {
  icon: React.ElementType;
  label: string;
  color: string;
  size?: "large" | "normal";
  onClick?: () => void;
  children?: React.ReactNode;
};

type FileUploadInputProps = {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  status?: string;
};

// Defining react components
const ControlCard: React.FC<ControlCardProps> = ({ 
  icon: Icon, 
  label, 
  color, 
  size = "normal", 
  onClick, 
  children 
}) => (
  <Card
    className={`flex flex-col items-center justify-center p-4 cursor-pointer transition-colors border hover:bg-opacity-90 
      ${color} ${size === "large" ? "col-span-2 row-span-2" : ""}`}
    onClick={onClick}
  >
    <Icon className={`${size === "large" ? "h-12 w-12" : "h-8 w-8"} mb-4 text-white`} />
    <span className="text-sm font-medium text-center text-white">{label}</span>
    {children}
  </Card>
);

const FileUploadInput: React.FC<FileUploadInputProps> = ({ onFileSelect, disabled, status }) => (
  <div className="mt-4 w-full">
    <input
      type="file"
      accept="video/*"
      onChange={onFileSelect}
      disabled={disabled}
      className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white file:text-blue-500 hover:file:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    {status && <p className="mt-2 text-sm text-white">{status}</p>}
  </div>
);

// Main component 
const ProjectorControl: React.FC = () => {
  // State management
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  // Custom hooks
  const { connected, statusMessage, connect, disconnect, sendCommand } = useNetworkConnection();
  const { isUploading, uploadStatus, sendVideo } = useVideoUpload();

  // Side effects
  useEffect(() => {
    if (statusMessage && !statusMessage.includes('No connection')) {
      setShowToast(true);
    }
  }, [statusMessage]);

  // Event handlers
  const handleNavigateToPage = (page: string) => {
    sendCommand(page.toLowerCase());
    setCurrentPage(page.toLowerCase());
  };

  const handleCommand = (command: string) => {
    sendCommand(command.toLowerCase());
  };

  const handleImageControlChange = (type: 'brightness' | 'contrast', value: number) => {
    if (type === 'brightness') {
      setBrightness(value);
      sendCommand(`brightness ${value}`);
    } else {
      setContrast(value);
      sendCommand(`contrast ${value}`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!connected) {
      alert('Please connect first');
      return;
    }
    if (file) await sendVideo(file);
  };

  // Render navigation page if a page is selected
  if (currentPage) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <NavigationManager 
          currentPage={currentPage} 
          onBack={() => setCurrentPage(null)}
          onCommand={handleCommand}
          isConnected={connected}
        />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      {/* Connection Status Bar */}
      <ConnectionStatusBar 
        connected={connected} 
        onConnect={connect} 
        onDisconnect={disconnect} 
      />

      {/* Notifications */}
      {showToast && (
        <Toast 
          message={statusMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      {/* Main Controls */}
      <div className="space-y-6">
        <ImageControls
          brightness={brightness}
          contrast={contrast}
          onBrightnessChange={(value) => handleImageControlChange('brightness', value)}
          onContrastChange={(value) => handleImageControlChange('contrast', value)}
        />

        {/* Control Grid */}
        <ControlGrid 
          onNavigate={handleNavigateToPage}
          onCommand={handleCommand}
          connected={connected}
          isUploading={isUploading}
          uploadStatus={uploadStatus}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

// Additional separated components
const ConnectionStatusBar: React.FC<{
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}> = ({ connected, onConnect, onDisconnect }) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-4">
      <Network className={`h-6 w-6 ${connected ? 'text-green-500' : 'text-red-500'}`} />
      <button
        onClick={connected ? onDisconnect : onConnect}
        className="px-4 py-2 flex items-center gap-2 rounded-full border bg-white hover:bg-gray-100"
      >
        <Power className="h-4 w-4" />
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  </div>
);

const ControlGrid: React.FC<{
  onNavigate: (page: string) => void;
  onCommand: (command: string) => void;
  connected: boolean;
  isUploading: boolean;
  uploadStatus?: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onNavigate, onCommand, connected, isUploading, uploadStatus, onFileUpload }) => (
  <div className="grid grid-cols-4 gap-4">
    <ControlCard
      icon={Files}
      label="File Management"
      color="bg-blue-500"
      size="large"
      onClick={() => onCommand("FileUploadInput")}
    >
      <FileUploadInput 
        onFileSelect={onFileUpload}
        disabled={!connected || isUploading}
        status={uploadStatus}
      />
    </ControlCard>

    <ControlCard
      icon={Monitor}
      label="System Info"
      color="bg-purple-500"
      onClick={() => onNavigate(PAGES.SYSTEM_INFO)}
    />

    <ControlCard
      icon={Settings}
      label="Settings"
      color="bg-amber-500"
      onClick={() => onNavigate(PAGES.SETTINGS)}
    />

    <ControlCard
      icon={Grid}
      label="Test Pattern"
      color="bg-green-500"
      onClick={() => onNavigate(PAGES.TEST_PATTERN)}
    />

    <ControlCard
      icon={RefreshCcw}
      label="Reset Options"
      color="bg-red-500"
      onClick={() => onNavigate(PAGES.RESET_OPTIONS)}
    />
  </div>
);

export default ProjectorControl;