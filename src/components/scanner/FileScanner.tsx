
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scan, Brain, Zap, FolderOpen, AlertTriangle } from 'lucide-react';
import { FileGrid } from './FileGrid';
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
  const [scanMessage, setScanMessage] = useState('Select a folder to scan for recoverable files.');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['images', 'documents', 'videos']);
  const [selectedFolder, setSelectedFolder] = useState('');
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
          
          canvas.width = 64;
          canvas.height = 64;
          
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
          
          const isSelectedType = selectedFileTypes.some(type => {
            switch (type) {
              case 'images': return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'raw', 'cr2', 'nef'].includes(extension);
              case 'videos': return ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'm4v', '3gp'].includes(extension);
              case 'documents': return ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);
              case 'audio': return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(extension);
              case 'archives': return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension);
              case 'executables': return ['exe', 'msi', 'apk', 'dmg', 'deb', 'rpm'].includes(extension);
              case 'iso': return ['iso', 'img', 'bin', 'cue', 'dmg'].includes(extension);
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
            
            // Simulate damage assessment based on file age
            const ageInDays = (Date.now() - file.lastModified) / (1000 * 60 * 60 * 24);
            let damage: 'none' | 'minor' | 'moderate' | 'severe' = 'none';
            if (ageInDays > 365) damage = 'minor';
            if (ageInDays > 730) damage = 'moderate';
            if (file.size === 0) damage = 'severe';
            
            foundFiles.push({
              id: `file_${foundFiles.length}`,
              name: file.name,
              type: extension,
              size: file.size,
              path: currentPath,
              thumbnail,
              recovered: false,
              damage,
              agent,
              lastModified: file.lastModified,
              file
            });
          }
        } else if (entry.kind === 'directory') {
          try {
            const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
            await scanDirectoryRecursively(subDirHandle, currentPath, foundFiles);
          } catch (error) {
            console.log(`Skipping directory ${entry.name}:`, error);
          }
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
        setSelectedFolder(dirHandle.name);
        return dirHandle;
      } else {
        toast({
          title: "Browser not supported",
          description: "Your browser doesn't support the File System Access API. Please use Chrome, Edge, or another supported browser.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Access denied",
          description: "Folder access was denied. Please try again and grant permission.",
          variant: "destructive"
        });
      }
      return null;
    }
  };

  const handleScan = async () => {
    if (!selectedFolder) {
      const dirHandle = await requestDirectoryAccess();
      if (!dirHandle) return;
      
      await performScan(dirHandle);
    } else {
      const dirHandle = await requestDirectoryAccess();
      if (dirHandle) {
        await performScan(dirHandle);
      }
    }
  };

  const performScan = async (dirHandle: any) => {
    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Scanning folder structure...');

    try {
      const scanSteps = [
        { progress: 10, message: 'SENTINEL: Analyzing folder permissions...', delay: 500 },
        { progress: 25, message: 'SPECTRA-X: Scanning for images and videos...', delay: 800 },
        { progress: 40, message: 'QUILL-X: Analyzing documents and text files...', delay: 1000 },
        { progress: 60, message: 'SENTINEL: Processing subdirectories...', delay: 1200 },
        { progress: 80, message: 'SPECTRA-X: Generating thumbnails...', delay: 800 },
        { progress: 95, message: 'QUILL-X: Finalizing file analysis...', delay: 400 }
      ];

      let foundFiles: ScannedFile[] = [];
      
      // Start background scanning
      const scanPromise = scanDirectoryRecursively(dirHandle);
      
      // Show progress steps
      for (const step of scanSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
        setScanMessage(step.message);
      }
      
      // Wait for scan to complete
      foundFiles = await scanPromise;
      
      setProgress(100);
      setScanMessage(`Scan complete! Found ${foundFiles.length} files.`);
      setScannedFiles(foundFiles);
      
      toast({
        title: "Scan Complete!",
        description: foundFiles.length > 0 
          ? `Found ${foundFiles.length} files in the selected folder`
          : "No files of the selected types found",
      });
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
        description: "Please select files to organize/backup",
        variant: "destructive"
      });
      return;
    }

    if (guestMode && selectedFiles.length > 5) {
      toast({
        title: "Free trial limit",
        description: "You can process up to 5 files for free. Sign up for unlimited access.",
        variant: "destructive"
      });
      onLoginRequired?.();
      return;
    }

    // Create download links for selected files
    selectedFiles.forEach(selectedFile => {
      if (selectedFile.file) {
        const url = URL.createObjectURL(selectedFile.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Files Downloaded",
      description: `Downloaded ${selectedFiles.length} files to your Downloads folder`,
    });
  };

  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='marble3'%3E%3Cstop offset='0%25' style='stop-color:%23440044;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23220022;stop-opacity:0.4'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble3)'/%3E%3C/svg%3E")`,
        backgroundSize: '150px 150px'
      }}></div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-white">
          <Scan className="h-6 w-6 text-purple-400" />
          Smart File Scanner & Organizer
          {guestMode && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Free Trial</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {scannedFiles.length === 0 && !isScanning && <ScannerHero />}

        {/* Browser Limitation Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Browser File Access</h4>
              <p className="text-gray-300 text-sm mb-2">
                This scanner can organize and backup existing files in folders you select. 
                For true deleted file recovery from hard drives, professional desktop software is required.
              </p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>✓ Scan any folder you choose</li>
                <li>✓ Find files by type and organize them</li>
                <li>✓ Create backups of important files</li>
                <li>✗ Cannot access hard drive directly (C:, D:, etc.)</li>
                <li>✗ Cannot recover truly deleted files</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Folder Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            Select Folder to Scan
          </div>
          <Button
            onClick={requestDirectoryAccess}
            variant="outline"
            className="w-full bg-black/60 border-gray-600 text-white hover:bg-gray-800"
          >
            {selectedFolder ? `Selected: ${selectedFolder}` : 'Choose Folder to Scan...'}
          </Button>
        </div>

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
              Scanning Folder...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Scan Selected Folder
            </>
          )}
        </Button>

        {scannedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Found {scannedFiles.length} Files
              </h3>
              <Button
                onClick={handleRecoverSelected}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Download Selected ({scannedFiles.filter(f => f.recovered).length})
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
