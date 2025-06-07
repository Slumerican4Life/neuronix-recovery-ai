import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Scan, Brain, Zap, FileText, Image, Music, Video, AlertTriangle, HardDrive, Search, Filter } from 'lucide-react';
import { FileGrid } from './FileGrid';
import { AgentStatus } from './AgentStatus';
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
}

export const FileScanner: React.FC<FileScannerProps> = ({ guestMode = false, onLoginRequired }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Ready to scan for lost files.');
  const [selectedDrive, setSelectedDrive] = useState('');
  const [scanType, setScanType] = useState<'quick' | 'deep' | 'custom'>('quick');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['images', 'documents', 'videos']);
  const [customLocation, setCustomLocation] = useState('');
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileTypes = [
    { id: 'images', label: 'Images (JPG, PNG, GIF, WEBP, BMP, TIFF)', icon: Image },
    { id: 'videos', label: 'Videos (MP4, AVI, MOV, MKV, WMV, FLV)', icon: Video },
    { id: 'documents', label: 'Documents (PDF, DOC, TXT, RTF, CSV, XLS)', icon: FileText },
    { id: 'audio', label: 'Audio (MP3, WAV, FLAC, AAC, OGG)', icon: Music },
    { id: 'archives', label: 'Archives (ZIP, RAR, 7Z, TAR, GZ)', icon: FileText },
    { id: 'executables', label: 'Programs (EXE, MSI, APK, DMG, DEB)', icon: AlertTriangle },
    { id: 'iso', label: 'Disk Images (ISO, IMG, BIN, CUE)', icon: HardDrive },
  ];

  const detectDrives = async () => {
    // In a real app, this would detect actual drives
    return [
      { id: 'C:', label: 'Local Disk (C:)', size: '500 GB', type: 'SSD' },
      { id: 'D:', label: 'Data Drive (D:)', size: '1 TB', type: 'HDD' },
      { id: 'E:', label: 'USB Drive (E:)', size: '32 GB', type: 'USB' },
    ];
  };

  const requestDirectoryAccess = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // @ts-ignore - File System Access API
        const dirHandle = await window.showDirectoryPicker();
        setCustomLocation(dirHandle.name);
        return dirHandle;
      } else {
        // Fallback for browsers without File System Access API
        directoryInputRef.current?.click();
        return null;
      }
    } catch (error) {
      console.error('Directory access denied:', error);
      return null;
    }
  };

  const generateMockFiles = (): ScannedFile[] => {
    const mockFiles: ScannedFile[] = [];
    const fileNames = [
      'vacation_photo_2023.jpg', 'important_document.pdf', 'family_video.mp4',
      'presentation.pptx', 'music_collection.mp3', 'backup_file.zip',
      'old_photo.png', 'deleted_contract.docx', 'home_movie.avi',
      'tax_documents.xlsx', 'wedding_photos.jpg', 'project_files.zip'
    ];

    fileNames.forEach((name, index) => {
      const type = name.split('.').pop() || '';
      let agent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' = 'SENTINEL';
      
      if (['jpg', 'png', 'gif', 'mp4', 'avi', 'mov'].includes(type)) {
        agent = 'SPECTRA-X';
      } else if (['pdf', 'docx', 'txt', 'xlsx', 'pptx'].includes(type)) {
        agent = 'QUILL-X';
      }

      mockFiles.push({
        id: `file_${index}`,
        name,
        type,
        size: Math.floor(Math.random() * 10000000) + 1000,
        path: `/${selectedDrive || 'C:'}/${name}`,
        thumbnail: type.includes('jpg') || type.includes('png') ? 
          `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="12">${type.toUpperCase()}</text></svg>`)}` 
          : undefined,
        recovered: false,
        damage: ['none', 'minor', 'moderate', 'severe'][Math.floor(Math.random() * 4)] as any,
        agent
      });
    });

    return mockFiles;
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

    if (scanType === 'custom' && !customLocation) {
      const dirHandle = await requestDirectoryAccess();
      if (!dirHandle) return;
    }

    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Initializing AI agents...');

    // Simulate scanning process with realistic messages
    const scanSteps = [
      { progress: 5, message: 'SENTINEL: Starting file system analysis...' },
      { progress: 15, message: 'SENTINEL: Scanning partition tables and file allocation...' },
      { progress: 25, message: 'SPECTRA-X: Searching for image and video signatures...' },
      { progress: 40, message: 'QUILL-X: Analyzing document fragments and headers...' },
      { progress: 55, message: 'SENTINEL: Performing deep sector scan...' },
      { progress: 70, message: 'SPECTRA-X: Reconstructing multimedia containers...' },
      { progress: 85, message: 'QUILL-X: Repairing corrupted document structures...' },
      { progress: 95, message: 'SENTINEL: Finalizing recovery candidates...' },
      { progress: 100, message: 'Scan complete! Found recoverable files.' }
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        const step = scanSteps[stepIndex];
        setProgress(step.progress);
        setScanMessage(step.message);
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        setIsScanning(false);
        const foundFiles = generateMockFiles();
        setScannedFiles(foundFiles);
        
        toast({
          title: "Scan Complete!",
          description: `Found ${foundFiles.length} recoverable files`,
        });
      }
    }, scanType === 'deep' ? 800 : scanType === 'quick' ? 400 : 600);
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

  const [drives] = useState([
    { id: 'C:', label: 'Local Disk (C:)', size: '500 GB', type: 'SSD' },
    { id: 'D:', label: 'Data Drive (D:)', size: '1 TB', type: 'HDD' },
    { id: 'E:', label: 'USB Drive (E:)', size: '32 GB', type: 'USB' },
  ]);

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
      {/* Marble background */}
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
        {/* Hero Image Area - Shows when no scan has been performed */}
        {scannedFiles.length === 0 && !isScanning && (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20 max-w-md mx-auto">
              {/* Placeholder for your brain + files + lightning image */}
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="relative">
                  <Brain className="h-16 w-16 text-purple-400" />
                  <Zap className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <div className="text-4xl">⚡</div>
                <div className="relative">
                  <Search className="h-16 w-16 text-blue-400" />
                  <div className="absolute inset-0 animate-ping">
                    <Search className="h-16 w-16 text-blue-400 opacity-75" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
                AI-Powered Recovery
              </h3>
              <p className="text-gray-300 text-sm">
                Start scanning to discover recoverable files with our advanced neural network
              </p>
            </div>
          </div>
        )}

        {/* Drive Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <HardDrive className="h-4 w-4 text-blue-400" />
            Drive Selection
          </div>
          <Select value={selectedDrive} onValueChange={setSelectedDrive}>
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

        {/* Scan Type */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <Search className="h-4 w-4 text-purple-400" />
            Scan Type
          </div>
          <RadioGroup value={scanType} onValueChange={(value: any) => setScanType(value)}>
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
                    setCustomLocation(e.target.files[0].webkitRelativePath.split('/')[0]);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* File Type Selection */}
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
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFileTypes([...selectedFileTypes, type.id]);
                    } else {
                      setSelectedFileTypes(selectedFileTypes.filter(t => t !== type.id));
                    }
                  }}
                />
                <Label htmlFor={type.id} className="text-white text-sm flex items-center gap-2">
                  <type.icon className="h-4 w-4 text-gray-400" />
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Scan Progress */}
        <div className="space-y-2">
          <div className="text-gray-300">
            {scanMessage}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Scan Button */}
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

        {/* Agent Status */}
        {isScanning && <AgentStatus />}

        {/* Scanned Files */}
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
