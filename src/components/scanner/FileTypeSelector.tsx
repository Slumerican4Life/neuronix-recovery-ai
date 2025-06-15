
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, Image, Video, FileText, Music, AlertTriangle, HardDrive, Database, Palette, Settings } from 'lucide-react';

interface FileType {
  id: string;
  label: string;
  icon: any;
  description: string;
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
    { 
      id: 'images', 
      label: 'Images & Photos', 
      icon: Image,
      description: 'JPG, PNG, GIF, WEBP, BMP, TIFF, RAW, HEIC, SVG'
    },
    { 
      id: 'videos', 
      label: 'Videos & Movies', 
      icon: Video,
      description: 'MP4, AVI, MOV, MKV, WMV, FLV, WEBM, MPG, VOB'
    },
    { 
      id: 'documents', 
      label: 'Documents & Text', 
      icon: FileText,
      description: 'PDF, DOC, TXT, RTF, CSV, XLS, PPT, ODT'
    },
    { 
      id: 'audio', 
      label: 'Audio & Music', 
      icon: Music,
      description: 'MP3, WAV, FLAC, AAC, OGG, M4A, OPUS'
    },
    { 
      id: 'archives', 
      label: 'Archives & Compressed', 
      icon: AlertTriangle,
      description: 'ZIP, RAR, 7Z, TAR, GZ, BZ2, XZ, CAB'
    },
    { 
      id: 'executables', 
      label: 'Programs & Apps', 
      icon: Settings,
      description: 'EXE, MSI, APK, DMG, DEB, APP, PKG'
    },
    { 
      id: 'iso', 
      label: 'Disk Images', 
      icon: HardDrive,
      description: 'ISO, IMG, BIN, CUE, VDI, VMDK'
    },
    { 
      id: 'databases', 
      label: 'Databases', 
      icon: Database,
      description: 'DB, SQLITE, MDB, SQL, BAK, ACCDB'
    },
    { 
      id: 'design', 
      label: 'Design Files', 
      icon: Palette,
      description: 'PSD, AI, SKETCH, FIGMA, XD, INDD, EPS'
    },
    { 
      id: 'system', 
      label: 'System Files', 
      icon: Settings,
      description: 'DLL, SYS, INI, CFG, REG, LOG'
    }
  ];

  const handleFileTypeToggle = (typeId: string, checked: boolean) => {
    if (checked) {
      onFileTypesChange([...selectedFileTypes, typeId]);
    } else {
      onFileTypesChange(selectedFileTypes.filter(t => t !== typeId));
    }
  };

  const handleSelectAll = () => {
    if (selectedFileTypes.length === fileTypes.length) {
      onFileTypesChange([]);
    } else {
      onFileTypesChange(fileTypes.map(t => t.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-medium">
          <Filter className="h-4 w-4 text-pink-400" />
          File Types for AI Recovery
        </div>
        <button
          onClick={handleSelectAll}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {selectedFileTypes.length === fileTypes.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fileTypes.map(type => (
          <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg bg-black/30 border border-gray-700/50 hover:border-purple-500/30 transition-colors">
            <Checkbox
              id={type.id}
              checked={selectedFileTypes.includes(type.id)}
              onCheckedChange={(checked) => handleFileTypeToggle(type.id, !!checked)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <Label htmlFor={type.id} className="text-white text-sm font-medium flex items-center gap-2 cursor-pointer">
                <type.icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {type.label}
              </Label>
              <p className="text-xs text-gray-400 mt-1 break-words">
                {type.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-xs text-gray-500">
        {selectedFileTypes.length} of {fileTypes.length} file types selected for AI analysis
      </div>
    </div>
  );
};
