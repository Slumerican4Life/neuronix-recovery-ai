
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface ScanTypeSelectorProps {
  scanType: 'quick' | 'deep' | 'custom';
  onScanTypeChange: (type: 'quick' | 'deep' | 'custom') => void;
  customLocation: string;
  onCustomLocationChange: (location: string) => void;
}

export const ScanTypeSelector: React.FC<ScanTypeSelectorProps> = ({
  scanType,
  onScanTypeChange,
  customLocation,
  onCustomLocationChange
}) => {
  const directoryInputRef = useRef<HTMLInputElement>(null);

  const requestDirectoryAccess = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // @ts-ignore - File System Access API
        const dirHandle = await window.showDirectoryPicker();
        onCustomLocationChange(dirHandle.name);
        return dirHandle;
      } else {
        directoryInputRef.current?.click();
        return null;
      }
    } catch (error) {
      console.error('Directory access denied:', error);
      return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white font-medium">
        <Search className="h-4 w-4 text-purple-400" />
        Scan Type
      </div>
      <RadioGroup value={scanType} onValueChange={(value: any) => onScanTypeChange(value)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="quick" id="quick" />
          <Label htmlFor="quick" className="text-white">Quick Scan (5-10 minutes) - Recently deleted files</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="deep" id="deep" />
          <Label htmlFor="deep" className="text-white">Deep Scan (30-60 minutes) - Complete drive analysis</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom" className="text-white">Custom Location - Specific folder scan</Label>
        </div>
      </RadioGroup>

      {scanType === 'custom' && (
        <div className="mt-2">
          <Button
            onClick={requestDirectoryAccess}
            variant="outline"
            className="bg-black/60 border-gray-600 text-white hover:bg-gray-800"
          >
            {customLocation ? `Selected: ${customLocation}` : 'Choose Folder...'}
          </Button>
          <input
            ref={directoryInputRef}
            type="file"
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onCustomLocationChange(e.target.files[0].webkitRelativePath.split('/')[0]);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
