'use client'

import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Sun, Zap } from 'lucide-react';

type ImageControlsProps = {
  brightness: number;
  contrast: number;
  disabled?: boolean;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
}

const SliderControl = ({
  Icon,
  label,
  value,
  onChange,
  disabled
}: {
  Icon: React.ElementType;
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">
        <Icon className="inline mr-2 h-4 w-4" />
        {label}
      </label>
      <span className="text-sm">{value}%</span>
    </div>
    <Slider
      value={[value]}
      onValueChange={([val]) => onChange(val)}
      max={100}
      step={1}
      disabled={disabled}
    />
  </div>
);

const ImageControls: React.FC<ImageControlsProps> = ({
  brightness,
  contrast,
  disabled = false,
  onBrightnessChange,
  onContrastChange,
}) => {
  return (
    <div className="space-y-4">
      <SliderControl
        Icon={Sun}
        label="Brightness"
        value={brightness}
        onChange={onBrightnessChange}
        disabled={disabled}
      />
      <SliderControl
        Icon={Zap}
        label="Contrast"
        value={contrast}
        onChange={onContrastChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ImageControls;