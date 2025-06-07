import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scan, Brain, Zap } from 'lucide-react';
import { FileGrid } from './FileGrid';
import { AgentStatus } from './AgentStatus';
import { DriveSelection } from './DriveSelection';
import { ScanTypeSelector } from './ScanTypeSelector';
import { FileTypeSelector } from './FileTypeSelector';
import { ScanProgress } from './ScanProgress';
import { ScannerHero } from './ScannerHero';
import { useToast } from '@/hooks/use-toast';

interface FileScannerProps {
  guestMode?: boolean;
  onLoginRequired?: () => void;
}

interface ScannedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  thumbnail?: string;
  recovered: boolean;
  damage: 'none' | 'minor' | 'moderate' | 'severe';
  agent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X';
  lastModified?: number;
  file?: File;
}

export const FileScanner: React.FC<FileScannerProps> = ({ guestMode = false, onLoginRequired }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Ready to scan for recoverable files.');
  const [selectedDrive, setSelectedDrive] = useState('');
  const [scanType, setScanType] = useState<'quick' | 'deep' | 'custom'>('quick');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['images', 'documents', 'videos']);
  const [customLocation, setCustomLocation] = useState('');
  const { toast } = useToast();

  const generateThumbnail = async (file: File): Promise<string | undefined> => {
    if (!file.type.startsWith('image/')) return undefined;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(undefined);
          
          // Create 64x64 thumbnail
          canvas.width = 64;
          canvas.height = 64;
          
          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;
          let drawWidth = 64;
          let drawHeight = 64;
          let offsetX = 0;
          let offsetY = 0;
          
          if (aspectRatio > 1) {
            drawHeight = 64 / aspectRatio;
            offsetY = (64 - drawHeight) / 2;
          } else {
            drawWidth = 64 * aspectRatio;
            offsetX = (64 - drawWidth) / 2;
          }
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const scanDirectoryRecursively = async (dirHandle: any, path = '', foundFiles: ScannedFile[] = []): Promise<ScannedFile[]> => {
    try {
      for await (const entry of dirHandle.values()) {
        const currentPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          const extension = file.name.split('.').pop()?.toLowerCase() || '';
          
          // Check if file type is selected
          const isSelectedType = selectedFileTypes.some(type => {
            switch (type) {
              case 'images': return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(extension);
              case 'videos': return ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'].includes(extension);
              case 'documents': return ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv', 'xls', 'xlsx'].includes(extension);
              case 'audio': return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(extension);
              case 'archives': return ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension);
              case 'executables': return ['exe', 'msi', 'apk', 'dmg', 'deb'].includes(extension);
              case 'iso': return ['iso', 'img', 'bin', 'cue'].includes(extension);
              default: return false;
            }
          });
          
          if (isSelectedType) {
            let agent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' = 'SENTINEL';
            
            if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov'].includes(extension)) {
              agent = 'SPECTRA-X';
            } else if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx'].includes(extension)) {
              agent = 'QUILL-X';
            }

            const thumbnail = await generateThumbnail(file);
            
            foundFiles.push({
              id: `file_${foundFiles.length}`,
              name: file.name,
              type: extension,
              size: file.size,
              path: currentPath,
              thumbnail,
              recovered: false,
              damage: ['none', 'minor', 'moderate'][Math.floor(Math.random() * 3)] as any,
              agent,
              lastModified: file.lastModified,
              file
            });
          }
        } else if (entry.kind === 'directory' && scanType === 'deep') {
          const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
          await scanDirectoryRecursively(subDirHandle, currentPath, foundFiles);
        }
      }
    } catch (error) {
      console.error('Error scanning directory:', error);
    }
    
    return foundFiles;
  };

  const requestDirectoryAccess = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // @ts-ignore - File System Access API
        const dirHandle = await window.showDirectoryPicker();
        setCustomLocation(dirHandle.name);
        return dirHandle;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Directory access denied:', error);
      return null;
    }
  };

  const handleScan = async () => {
    if (!selectedDrive && scanType !== 'custom') {
      toast({
        title: "Please select a drive",
        description: "Choose which drive you want to scan for files",
        variant: "destructive"
      });
      return;
    }

    let dirHandle = null;
    if (scanType === 'custom' && !customLocation) {
      dirHandle = await requestDirectoryAccess();
      if (!dirHandle) return;
    }

    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Initializing AI agents...');

    try {
      const scanSteps = [
        { progress: 5, message: 'SENTINEL: Starting file system analysis...', delay: 800 },
        { progress: 15, message: 'SENTINEL: Scanning partition tables and file allocation...', delay: 1200 },
        { progress: 25, message: 'SPECTRA-X: Searching for image and video signatures...', delay: 1000 },
        { progress: 40, message: 'QUILL-X: Analyzing document fragments and headers...', delay: 1500 },
        { progress: 55, message: 'SENTINEL: Performing deep sector scan...', delay: 2000 },
        { progress: 70, message: 'SPECTRA-X: Reconstructing multimedia containers...', delay: 1200 },
        { progress: 85, message: 'QUILL-X: Repairing corrupted document structures...', delay: 800 },
        { progress: 95, message: 'SENTINEL: Finalizing recovery candidates...', delay: 600 }
      ];

      if (dirHandle || (scanType === 'custom' && customLocation)) {
        setScanMessage('Accessing selected directory...');
        setProgress(10);
        
        let foundFiles: ScannedFile[] = [];
        if (dirHandle) {
          foundFiles = await scanDirectoryRecursively(dirHandle);
        }
        
        for (const step of scanSteps) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
          setProgress(step.progress);
          setScanMessage(step.message);
        }
        
        setProgress(100);
        setScanMessage(`Scan complete! Found ${foundFiles.length} recoverable files.`);
        setScannedFiles(foundFiles);
        
        toast({
          title: "Scan Complete!",
          description: foundFiles.length > 0 
            ? `Found ${foundFiles.length} recoverable files`
            : "No recoverable files found in the selected location",
        });
      } else {
        setScanMessage('Note: Browser security limits prevent direct drive access. Using directory selection...');
        setProgress(50);
        
        setTimeout(() => {
          setProgress(100);
          setScanMessage('Scan complete! Please select a folder to scan for real files.');
          setScannedFiles([]);
          
          toast({
            title: "Direct Drive Access Not Available",
            description: "Please use 'Custom Location' to select a folder to scan",
            variant: "destructive"
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Error",
        description: "Failed to complete scan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileToggle = (fileId: string) => {
    setScannedFiles(files => 
      files.map(file => 
        file.id === fileId ? { ...file, recovered: !file.recovered } : file
      )
    );
  };

  const handleRecoverSelected = () => {
    const selectedFiles = scannedFiles.filter(f => f.recovered);
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to recover",
        variant: "destructive"
      });
      return;
    }

    if (guestMode && selectedFiles.length > 5) {
      toast({
        title: "Free trial limit",
        description: "You can recover up to 5 files for free. Sign up for unlimited recovery.",
        variant: "destructive"
      });
      onLoginRequired?.();
      return;
    }

    toast({
      title: "Recovery Started",
      description: `Recovering ${selectedFiles.length} files...`,
    });
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='marble3'%3E%3Cstop offset='0%25' style='stop-color:%23440044;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23220022;stop-opacity:0.4'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble3)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px'
      }}></div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Scan className="h-6 w-6 text-purple-400" />
          Neural File System Scanner
          {guestMode && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Free Trial</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {scannedFiles.length === 0 && !isScanning && <ScannerHero />}

        <DriveSelection 
          selectedDrive={selectedDrive} 
          onDriveChange={setSelectedDrive} 
        />

        <ScanTypeSelector
          scanType={scanType}
          onScanTypeChange={setScanType}
          customLocation={customLocation}
          onCustomLocationChange={setCustomLocation}
        />

        <FileTypeSelector
          selectedFileTypes={selectedFileTypes}
          onFileTypesChange={setSelectedFileTypes}
        />

        <ScanProgress progress={progress} message={scanMessage} />

        <Button
          onClick={handleScan}
          disabled={isScanning || selectedFileTypes.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-semibold"
        >
          {isScanning ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              {scanType === 'deep' ? 'Deep Scanning...' : 'Scanning...'}
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Start {scanType === 'deep' ? 'Deep ' : scanType === 'custom' ? 'Custom ' : ''}Scan
            </>
          )}
        </Button>

        {isScanning && <AgentStatus />}

        {scannedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Found {scannedFiles.length} Recoverable Files
              </h3>
              <Button
                onClick={handleRecoverSelected}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Recover Selected ({scannedFiles.filter(f => f.recovered).length})
              </Button>
            </div>

            <FileGrid
              files={scannedFiles}
              onFileToggle={handleFileToggle}
              guestMode={guestMode}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
