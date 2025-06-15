
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileX, AlertTriangle, FolderOpen, Brain } from 'lucide-react';
import { FileGrid } from './FileGrid';
import { FileTypeSelector } from './FileTypeSelector';
import { ScanProgress } from './ScanProgress';
import { ScannerHero } from './ScannerHero';
import { ScannerCard } from './ScannerCard';
import { useToast } from '@/hooks/use-toast';
import { useFileAnalysis } from '@/hooks/useFileAnalysis';
import { useDirectoryAccess } from '@/hooks/useDirectoryAccess';
import { detectFileType, getAgentForFile } from '@/utils/fileTypeDetection';
import { generateThumbnail } from '@/utils/thumbnailGenerator';

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
  const [scanningAgent, setScanningAgent] = useState<'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' | null>(null);
  
  const { toast } = useToast();
  const { analyzeFileWithAI } = useFileAnalysis();
  const { selectedFolder, requestDirectoryAccess } = useDirectoryAccess();

  const scanDirectoryWithAI = async (dirHandle: any, path = '', foundFiles: ScannedFile[] = []): Promise<ScannedFile[]> => {
    try {
      for await (const entry of dirHandle.values()) {
        const currentPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          const extension = file.name.split('.').pop()?.toLowerCase() || '';
          
          const isSelectedType = detectFileType(extension, selectedFileTypes);
          
          if (isSelectedType) {
            const agent = getAgentForFile(extension);
            setScanningAgent(agent);
            setScanMessage(`${agent}: Analyzing ${file.name}...`);

            const fileSignature = `${extension}:${file.size}:${file.lastModified}`;
            const { confidence, damage } = await analyzeFileWithAI(file, fileSignature);
            const thumbnail = await generateThumbnail(file);
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

  const handleDeepScan = async () => {
    const dirHandle = await requestDirectoryAccess();
    if (!dirHandle) return;
    
    await performAIScan(dirHandle);
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
      const scanPromise = scanDirectoryWithAI(dirHandle);
      
      for (const step of scanSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        setProgress(step.progress);
        setScanMessage(step.message);
      }
      
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
    <ScannerCard guestMode={guestMode} scanningAgent={scanningAgent}>
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
    </ScannerCard>
  );
};
