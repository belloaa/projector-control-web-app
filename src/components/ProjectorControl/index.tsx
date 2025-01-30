import React, { useState, useEffect } from 'react';
import { useNetworkConnection } from '@/hooks/useNetworkConnection';
import { videoUpload } from '@/hooks/videoUpload';
import { Card } from "@/components/ui/card";
import { Power, Settings, RefreshCcw, Files, Monitor, Grid, Network } from 'lucide-react';
import { Toast } from './Toast';
import ImageControls from './ImageControls';
import NavigationManager from './NavigationManager';

const ProjectorControl = () => {
  // State management
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  // Custom hooks
  const { connected, statusMessage, connect, disconnect, sendCommand } = useNetworkConnection();
  const { isUploading, uploadStatus, sendVideo } = videoUpload();

  // Toast visibility control
  useEffect(() => {
    if (statusMessage && !statusMessage.includes('No connection')) {
      setShowToast(true);
    }
  }, [statusMessage]);

  // Command handlers
  const handlePage = (command: string) => {
    //if (!connected) return;
    sendCommand(command.toLowerCase()).catch(console.error);
    setCurrentPage(command.toLowerCase());
  };

  const handleCommand = (command: string) => {
    //if (!connected) return;
    sendCommand(command.toLowerCase()).catch(console.error);
  };

  //sending commands for contrast
  const handleCSlider = (value: number) => {
    //if (!connected) return;
    setContrast(value);
    sendCommand(`contrast ${value}`);
  };

  //sending commands for brightness
  const handleBSlider = (value: number) => {
    //if (!connected) return;
    setBrightness(value);
    sendCommand(`brightness ${value}`);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!connected) return alert('Please connect first');
    if (file) await sendVideo(file);
  };

  // If a page is currently showing, only render that
  if (currentPage) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
      <NavigationManager 
        currentPage={currentPage} 
        onBack={() => setCurrentPage(null)} 
      />
      </div>

    );
  }

  // Otherwise render the main dashboard
  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      {/* Connection Status Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Network className={`h-6 w-6 ${connected ? 'text-green-500' : 'text-red-500'}`} />
          <button
            onClick={connected ? disconnect : connect}
            className="px-4 py-2 flex items-center gap-2 rounded-full border bg-white hover:bg-gray-100"
          >
            <Power className="h-4 w-4" />
            {connected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {showToast && <Toast message={statusMessage} onClose={() => setShowToast(false)} />}
      
      {/* Main Controls */}
      <div className="space-y-6">
        <ImageControls
          brightness={brightness}
          contrast={contrast}
          onBrightnessChange={handleBSlider}
          onContrastChange={handleCSlider}
          //disabled={!connected}
          
        />

        {/* Control Grid */}
        <div className="grid grid-cols-4 gap-4">
          <ControlCard
            icon={Files}
            label="File Management"
            color="bg-blue-500"
            size="large"
            onClick={() => handleCommand("FileUploadInput")}
          >
            <FileUploadInput 
              onFileSelect={handleFileUpload}
              disabled={ !connected || isUploading}
              status={uploadStatus}
            />
          </ControlCard>

          <ControlCard
            icon={Monitor}
            label="System Info"
            color="bg-purple-500"
            onClick={() => handlePage("system_info")}
          />

          <ControlCard
            icon={Settings}
            label="Settings"
            color="bg-amber-500"
            onClick={() => handlePage("settings")}
          />

          <ControlCard
            icon={Grid}
            label="Test Pattern"
            color="bg-green-500"
            onClick={() => handlePage("test_pattern")}
          />

          <ControlCard
            icon={RefreshCcw}
            label="Reset Options"
            color="bg-red-500"
            onClick={() => handlePage("reset_options")}
          />
        </div>
      </div>
    </div>
  );
};

// Extracted Components
const ControlCard = ({ 
  icon: Icon, 
  label, 
  color, 
  size = "normal", 
  onClick, 
  children 
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  size?: "large" | "normal";
  onClick?: () => void;
  children?: React.ReactNode;
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

const FileUploadInput = ({ onFileSelect, disabled, status }: {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  status?: string;
}) => (
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

export default ProjectorControl;