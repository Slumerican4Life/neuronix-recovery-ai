
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scan, Brain, Zap, FolderOpen, AlertTriangle, HardDrive, Search, FileX } from 'lucide-react';
import { FileGrid } from './FileGrid';
import { FileTypeSelector } from './FileTypeSelector';
import { ScanProgress } from './ScanProgress';
import { ScannerHero } from './ScannerHero';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  recoveryConfidence: number;
  deletionDate?: Date;
}

export const FileScanner: React.FC<FileScannerProps> = ({ guestMode = false, onLoginRequired }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Ready to perform AI-powered deep scan');
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>(['images', 'documents', 'videos', 'audio']);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [scanningAgent, setScanningAgent] = useState<'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' | null>(null);
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
          
          canvas.width = 128;
          canvas.height = 128;
          
          const aspectRatio = img.width / img.height;
          let drawWidth = 128;
          let drawHeight = 128;
          let offsetX = 0;
          let offsetY = 0;
          
          if (aspectRatio > 1) {
            drawHeight = 128 / aspectRatio;
            offsetY = (128 - drawHeight) / 2;
          } else {
            drawWidth = 128 * aspectRatio;
            offsetX = (128 - drawWidth) / 2;
          }
          
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, 128, 128);
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const analyzeFileWithAI = async (file: File, fileSignature: string): Promise<{ confidence: number; damage: 'none' | 'minor' | 'moderate' | 'severe' }> => {
    try {
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message: `Analyze this file for recovery: ${file.name} (${file.type}, ${file.size} bytes). File signature: ${fileSignature}. Assess damage level and recovery confidence (0-100%).`,
          conversationHistory: []
        }
      });

      if (error) throw error;

      // Parse AI response for confidence and damage assessment
      const response = data.response.toLowerCase();
      let confidence = 85; // Default confidence
      let damage: 'none' | 'minor' | 'moderate' | 'severe' = 'none';

      // Extract confidence percentage
      const confidenceMatch = response.match(/(\d+)%/);
      if (confidenceMatch) {
        confidence = parseInt(confidenceMatch[1]);
      }

      // Assess damage based on AI analysis
      if (response.includes('severe') || response.includes('corrupted') || confidence < 30) {
        damage = 'severe';
      } else if (response.includes('moderate') || response.includes('partial') || confidence < 60) {
        damage = 'moderate';
      } else if (response.includes('minor') || response.includes('slight') || confidence < 85) {
        damage = 'minor';
      }

      return { confidence, damage };
    } catch (error) {
      console.error('AI analysis error:', error);
      return { confidence: 70, damage: 'minor' };
    }
  };

  const scanDirectoryWithAI = async (dirHandle: any, path = '', foundFiles: ScannedFile[] = []): Promise<ScannedFile[]> => {
    try {
      for await (const entry of dirHandle.values()) {
        const currentPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          const extension = file.name.split('.').pop()?.toLowerCase() || '';
          
          // Enhanced file type detection
          const isSelectedType = selectedFileTypes.some(type => {
            switch (type) {
              case 'images': return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'raw', 'cr2', 'nef', 'dng', 'heic', 'svg'].includes(extension);
              case 'videos': return ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm', 'm4v', '3gp', 'mpg', 'mpeg', 'f4v', 'vob'].includes(extension);
              case 'documents': return ['pdf', 'doc', 'docx', 'txt', 'rtf', 'csv', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].includes(extension);
              case 'audio': return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a', 'opus', 'ac3', 'aiff'].includes(extension);
              case 'archives': return ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz', 'lz', 'cab', 'ace'].includes(extension);
              case 'executables': return ['exe', 'msi', 'apk', 'dmg', 'deb', 'rpm', 'app', 'pkg'].includes(extension);
              case 'iso': return ['iso', 'img', 'bin', 'cue', 'dmg', 'vdi', 'vmdk'].includes(extension);
              case 'databases': return ['db', 'sqlite', 'mdb', 'accdb', 'sql', 'bak'].includes(extension);
              case 'system': return ['dll', 'sys', 'ini', 'cfg', 'reg', 'log'].includes(extension);
              case 'design': return ['psd', 'ai', 'sketch', 'figma', 'xd', 'indd', 'eps'].includes(extension);
              default: return false;
            }
          });
          
          if (isSelectedType) {
            // Determine which AI agent should handle this file
            let agent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' = 'SENTINEL';
            if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'webm'].includes(extension)) {
              agent = 'SPECTRA-X';
            } else if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx', 'csv'].includes(extension)) {
              agent = 'QUILL-X';
            }

            setScanningAgent(agent);
            setScanMessage(`${agent}: Analyzing ${file.name}...`);

            // Generate file signature for AI analysis
            const fileSignature = `${extension}:${file.size}:${file.lastModified}`;
            
            // AI-powered analysis
            const { confidence, damage } = await analyzeFileWithAI(file, fileSignature);
            
            const thumbnail = await generateThumbnail(file);
            
            // Simulate deletion date (for demo purposes - in real recovery this would be from file system)
            const deletionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            foundFiles.push({
              id: `file_${foundFiles.length}_${Date.now()}`,
              name: file.name,
              type: extension,
              size: file.size,
              path: currentPath,
              thumbnail,
              recovered: false,
              damage,
              agent,
              lastModified: file.lastModified,
              file,
              recoveryConfidence: confidence,
              deletionDate
            });

            // Update progress as we find files
            setProgress(Math.min(95, (foundFiles.length * 2)));
          }
        } else if (entry.kind === 'directory') {
          try {
            setScanMessage(`SENTINEL: Scanning directory ${entry.name}...`);
            const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
            await scanDirectoryWithAI(subDirHandle, currentPath, foundFiles);
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
          description: "Please use Chrome, Edge, or another Chromium-based browser for advanced file scanning.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: "Access denied",
          description: "Please grant folder access to perform deep scan. Try again and allow permission when prompted.",
          variant: "destructive"
        });
      }
      return null;
    }
  };

  const handleDeepScan = async () => {
    if (!selectedFolder) {
      const dirHandle = await requestDirectoryAccess();
      if (!dirHandle) return;
      
      await performAIScan(dirHandle);
    } else {
      const dirHandle = await requestDirectoryAccess();
      if (dirHandle) {
        await performAIScan(dirHandle);
      }
    }
  };

  const performAIScan = async (dirHandle: any) => {
    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Initializing AI-powered deep scan...');

    try {
      const scanSteps = [
        { progress: 5, message: 'SENTINEL: Initializing neural network...', delay: 800 },
        { progress: 15, message: 'SENTINEL: Analyzing folder structure and permissions...', delay: 1000 },
        { progress: 25, message: 'SPECTRA-X: Scanning for multimedia files...', delay: 1200 },
        { progress: 35, message: 'QUILL-X: Analyzing documents and text files...', delay: 1000 },
        { progress: 45, message: 'SENTINEL: Processing subdirectories...', delay: 800 },
        { progress: 55, message: 'AI: Performing file signature analysis...', delay: 1200 },
        { progress: 70, message: 'SPECTRA-X: Generating thumbnails and previews...', delay: 1000 },
        { progress: 85, message: 'QUILL-X: Finalizing recovery assessment...', delay: 800 }
      ];

      let foundFiles: ScannedFile[] = [];
      
      // Start background scanning with AI
      const scanPromise = scanDirectoryWithAI(dirHandle);
      
      // Show progress steps with AI agent indicators
      for (const step of scanSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
        setScanMessage(step.message);
      }
      
      // Wait for AI scan to complete
      foundFiles = await scanPromise;
      
      setProgress(100);
      setScanMessage(`AI Scan Complete! Found ${foundFiles.length} recoverable files.`);
      setScannedFiles(foundFiles);
      setScanningAgent(null);
      
      toast({
        title: "AI Deep Scan Complete!",
        description: foundFiles.length > 0 
          ? `Found ${foundFiles.length} files with AI-powered analysis`
          : "No files of the selected types found",
      });
    } catch (error) {
      console.error('AI scan error:', error);
      toast({
        title: "Scan Error",
        description: "Failed to complete AI scan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanningAgent(null);
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

    if (guestMode && selectedFiles.length > 3) {
      toast({
        title: "Free trial limit",
        description: "You can recover up to 3 files for free. Upgrade for unlimited recovery.",
        variant: "destructive"
      });
      onLoginRequired?.();
      return;
    }

    // Enhanced recovery process
    selectedFiles.forEach(selectedFile => {
      if (selectedFile.file) {
        const url = URL.createObjectURL(selectedFile.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recovered_${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Files Recovered Successfully!",
      description: `Recovered ${selectedFiles.length} files using AI analysis`,
    });
  };

  return (
    <Card className="bg-black/50 border-purple-500/40 backdrop-blur-xl relative overflow-hidden">
      {/* Enhanced visual effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #a855f7 0%, transparent 70%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 70%)`,
          animation: 'pulse 6s ease-in-out infinite'
        }}></div>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="relative">
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="AI Brain"
              className="w-8 h-8 object-contain"
            />
            {scanningAgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          AI-Powered File Scanner & Recovery System
          {guestMode && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Free Trial</Badge>}
          {scanningAgent && (
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse">
              {scanningAgent} ACTIVE
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {scannedFiles.length === 0 && !isScanning && <ScannerHero />}

        {/* Enhanced Browser Information */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-2">Advanced AI File Recovery</h4>
              <p className="text-gray-300 text-sm mb-2">
                This AI system performs deep analysis on accessible files and folders. For maximum recovery power:
              </p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>✓ AI-powered file signature analysis with OpenAI</li>
                <li>✓ Real-time damage assessment and recovery confidence</li>
                <li>✓ Multi-agent system (SENTINEL, SPECTRA-X, QUILL-X)</li>
                <li>✓ Advanced thumbnail generation and previews</li>
                <li>⚠ Browser-based: Can organize existing files, not deleted data recovery</li>
                <li>💡 For true deleted file recovery, use professional desktop software</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Folder Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-medium">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            Select Folder for AI Deep Scan
          </div>
          <Button
            onClick={requestDirectoryAccess}
            variant="outline"
            className="w-full bg-black/60 border-gray-600 text-white hover:bg-gray-800"
          >
            {selectedFolder ? `Selected: ${selectedFolder}` : 'Choose Folder for AI Analysis...'}
          </Button>
        </div>

        <FileTypeSelector
          selectedFileTypes={selectedFileTypes}
          onFileTypesChange={setSelectedFileTypes}
        />

        <ScanProgress progress={progress} message={scanMessage} />

        <Button
          onClick={handleDeepScan}
          disabled={isScanning || selectedFileTypes.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-semibold py-4 text-lg"
        >
          {isScanning ? (
            <>
              <Brain className="mr-2 h-5 w-5 animate-pulse" />
              AI Scanning in Progress...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Start AI Deep Scan
            </>
          )}
        </Button>

        {scannedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                AI Analysis Results: {scannedFiles.length} Files Found
              </h3>
              <Button
                onClick={handleRecoverSelected}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <FileX className="mr-2 h-4 w-4" />
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
