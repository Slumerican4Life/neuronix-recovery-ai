
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, Image, Video, FileText, Music, AlertTriangle, HardDrive } from 'lucide-react';

interface FileType {
  id: string;
  label: string;
  icon: any;
}

interface FileTypeSelectorProps {
  selectedFileTypes: string[];
  onFileTypesChange: (types: string[]) => void;
}

export const FileTypeSelector: React.FC<FileTypeSelectorProps> = ({
  selectedFileTypes,
  onFileTypesChange
}) => {
  const fileTypes: FileType[] = [
    { id: 'images', label: 'Images (JPG, PNG, GIF, WEBP, BMP, TIFF)', icon: Image },
    { id: 'videos', label: 'Videos (MP4, AVI, MOV, MKV, WMV, FLV)', icon: Video },
    { id: 'documents', label: 'Documents (PDF, DOC, TXT, RTF, CSV, XLS)', icon: FileText },
    { id: 'audio', label: 'Audio (MP3, WAV, FLAC, AAC, OGG)', icon: Music },
    { id: 'archives', label: 'Archives (ZIP, RAR, 7Z, TAR, GZ)', icon: FileText },
    { id: 'executables', label: 'Programs (EXE, MSI, APK, DMG, DEB)', icon: AlertTriangle },
    { id: 'iso', label: 'Disk Images (ISO, IMG, BIN, CUE)', icon: HardDrive },
  ];

  const handleFileTypeToggle = (typeId: string, checked: boolean) => {
    if (checked) {
      onFileTypesChange([...selectedFileTypes, typeId]);
    } else {
      onFileTypesChange(selectedFileTypes.filter(t => t !== typeId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white font-medium">
        <Filter className="h-4 w-4 text-pink-400" />
        File Types to Recover
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fileTypes.map(type => (
          <div key={type.id} className="flex items-center space-x-2">
            <Checkbox
              id={type.id}
              checked={selectedFileTypes.includes(type.id)}
              onCheckedChange={(checked) => handleFileTypeToggle(type.id, !!checked)}
            />
            <Label htmlFor={type.id} className="text-white text-sm flex items-center gap-2">
              <type.icon className="h-4 w-4 text-gray-400" />
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
