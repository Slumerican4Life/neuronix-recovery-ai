
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardDrive } from 'lucide-react';

interface Drive {
  id: string;
  label: string;
  size: string;
  type: string;
}

interface DriveSelectionProps {
  selectedDrive: string;
  onDriveChange: (drive: string) => void;
}

export const DriveSelection: React.FC<DriveSelectionProps> = ({ selectedDrive, onDriveChange }) => {
  const drives: Drive[] = [
    { id: 'C:', label: 'Local Disk (C:)', size: '500 GB', type: 'SSD' },
    { id: 'D:', label: 'Data Drive (D:)', size: '1 TB', type: 'HDD' },
    { id: 'E:', label: 'USB Drive (E:)', size: '32 GB', type: 'USB' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white font-medium">
        <HardDrive className="h-4 w-4 text-blue-400" />
        Drive Selection
      </div>
      <Select value={selectedDrive} onValueChange={onDriveChange}>
        <SelectTrigger className="bg-black/60 border-gray-600 text-white">
          <SelectValue placeholder="Select drive to scan" />
        </SelectTrigger>
        <SelectContent className="bg-black border-gray-600">
          {drives.map(drive => (
            <SelectItem key={drive.id} value={drive.id} className="text-white">
              {drive.label} - {drive.size} ({drive.type})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
