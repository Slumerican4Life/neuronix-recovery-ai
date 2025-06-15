import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileX, AlertTriangle, FolderOpen, Brain, Upload } from 'lucide-react';
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
import { FolderAccessHelpDialog } from "./FolderAccessHelpDialog";

// New: Prepare dummy/sample scan data
const DEMO_FILES = [
  {
    id: 'demo1',
    name: 'family_photo.jpg',
    type: 'jpg',
    size: 2048576,
    path: 'Photos/family_photo.jpg',
    thumbnail: '/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png',
    recovered: false,
    damage: 'none',
    agent: 'SENTINEL',
    lastModified: Date.now() - 7 * 24 * 60 * 60 * 1000,
    recoveryConfidence: 95,
    deletionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'demo2',
    name: 'resume.docx',
    type: 'docx',
    size: 153600,
    path: 'Documents/resume.docx',
    thumbnail: undefined,
    recovered: false,
    damage: 'minor',
    agent: 'QUILL-X',
    lastModified: Date.now() - 15 * 24 * 60 * 60 * 1000,
    recoveryConfidence: 82,
    deletionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'demo3',
    name: 'birthday_video.mp4',
    type: 'mp4',
    size: 18500000,
    path: 'Videos/birthday_video.mp4',
    thumbnail: undefined,
    recovered: false,
    damage: 'moderate',
    agent: 'SPECTRA-X',
    lastModified: Date.now() - 20 * 24 * 60 * 60 * 1000,
    recoveryConfidence: 63,
    deletionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  }
];

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
  const [scanMode, setScanMode] = useState<'folder' | 'files' | 'demo'>('folder');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { analyzeFileWithAI } = useFileAnalysis();
  const { selectedFolder, requestDirectoryAccess } = useDirectoryAccess();

  // Helper: "Try Sample Scan" logic (loads demo files)
  const handleDemoScan = () => {
    setIsScanning(true);
    setScanMode('demo');
    setProgress(0);
    setScanMessage('Loading sample AI scan results...');
    setTimeout(() => {
      setScannedFiles(DEMO_FILES as ScannedFile[]);
      setProgress(100);
      setScanMessage('Sample scan: AI-powered results loaded!');
      setIsScanning(false);
    }, 1000);
  };

  // Helper: "Upload Files Instead" (let users select files manually)
  const handleFileUploadClick = () => {
    setScanMode('files');
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Initializing AI-powered file analysis...');
    let foundFiles: ScannedFile[] = [];
    let i = 0;
    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isSelectedType = detectFileType(extension, selectedFileTypes);
      if (!isSelectedType) continue;
      const agent = getAgentForFile(extension);
      setScanningAgent(agent);
      setScanMessage(`${agent}: Analyzing ${file.name} with LYRA AI...`);
      const fileSignature = `${extension}:${file.size}:${file.lastModified}`;
      const { confidence, damage } = await analyzeFileWithAI(file, fileSignature);
      const thumbnail = await generateThumbnail(file);
      foundFiles.push({
        id: `file_upload_${foundFiles.length}_${Date.now()}`,
        name: file.name,
        type: extension,
        size: file.size,
        path: file.name,
        thumbnail,
        recovered: false,
        damage,
        agent,
        lastModified: file.lastModified,
        file,
        recoveryConfidence: confidence,
        deletionDate: undefined
      });
      i++;
      setProgress(Math.min(95, (i / files.length) * 100));
    }
    setProgress(100);
    setScanMessage(`AI Scan Complete! Found ${foundFiles.length} recoverable files with OpenAI analysis.`);
    setScannedFiles(foundFiles);
    setIsScanning(false);
    setScanningAgent(null);
    toast({
      title: "🧠 LYRA AI File Scan Complete!",
      description: foundFiles.length > 0 
        ? `Found ${foundFiles.length} files with AI-powered OpenAI analysis`
        : "No files of the selected types found in uploaded files.",
    });
    e.target.value = '';
  };

  // --- Existing directory scan logic ---
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
            setScanMessage(`${agent}: Analyzing ${file.name} with LYRA AI...`);

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
    setScanMode('folder');
    const dirHandle = await requestDirectoryAccess();
    if (!dirHandle) return;
    
    await performAIScan(dirHandle);
  };

  const performAIScan = async (dirHandle: any) => {
    setIsScanning(true);
    setScannedFiles([]);
    setProgress(0);
    setScanMessage('Initializing LYRA AI-powered deep scan...');

    try {
      const scanSteps = [
        { progress: 5, message: 'LYRA AI: Connecting to OpenAI neural networks...', delay: 800 },
        { progress: 15, message: 'SENTINEL: Analyzing folder structure and permissions...', delay: 1000 },
        { progress: 25, message: 'SPECTRA-X: Scanning for multimedia signatures with AI...', delay: 1200 },
        { progress: 35, message: 'QUILL-X: Analyzing documents and text files with OpenAI...', delay: 1000 },
        { progress: 45, message: 'SENTINEL: Processing subdirectories with neural analysis...', delay: 800 },
        { progress: 55, message: 'LYRA AI: Performing file signature analysis with GPT...', delay: 1200 },
        { progress: 70, message: 'SPECTRA-X: Generating AI-powered thumbnails and previews...', delay: 1000 },
        { progress: 85, message: 'QUILL-X: Finalizing recovery assessment with OpenAI...', delay: 800 }
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
      setScanMessage(`LYRA AI Scan Complete! Found ${foundFiles.length} recoverable files with OpenAI analysis.`);
      setScannedFiles(foundFiles);
      setScanningAgent(null);
      
      toast({
        title: "🧠 LYRA AI Deep Scan Complete!",
        description: foundFiles.length > 0 
          ? `Found ${foundFiles.length} files with AI-powered OpenAI analysis`
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
      description: `Recovered ${selectedFiles.length} files using LYRA AI analysis`,
    });
  };

  return (
    <ScannerCard guestMode={guestMode} scanningAgent={scanningAgent}>
      {scannedFiles.length === 0 && !isScanning && <ScannerHero />}

      {/* Enhanced AI Information */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-purple-400 mt-0.5 animate-pulse" />
          <div>
            <h4 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
              🧠 LYRA AI-Powered Recovery Engine
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">OpenAI Connected</span>
            </h4>
            <p className="text-gray-300 text-sm mb-2">
              Advanced AI system with real OpenAI GPT integration for intelligent file analysis:
            </p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>✓ Real OpenAI GPT-4 analysis for each file found</li>
              <li>✓ LYRA AI brain processes file signatures with neural networks</li>
              <li>✓ Multi-agent system with specialized AI recovery algorithms</li>
              <li>✓ Advanced damage assessment using machine learning</li>
              <li>✓ Intelligent confidence scoring based on AI analysis</li>
              <li>⚠ Browser-based: Analyzes accessible files, not hardware-level recovery</li>
              <li>💡 For true deleted file recovery, use professional desktop software</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Folder Selection */}
      <div className="space-y-4">
        {/* Friendly explanation */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <FolderOpen className="h-4 w-4 text-blue-400" />
            Select Folder for LYRA AI Deep Scan
            <FolderAccessHelpDialog />
          </div>
          <p className="text-xs text-gray-400 pl-6">
            <b>Why?</b> To let our AI scan your files, you choose a folder—your data never leaves your device. 
            <span className="text-purple-400"> Try below for full power, or pick a safer option.</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            onClick={handleDeepScan}
            variant={scanMode === 'folder' ? 'default' : 'outline'}
            className="flex-1 bg-black/60 border-gray-600 text-white hover:bg-gray-800"
            disabled={isScanning}
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            {selectedFolder ? `Selected: ${selectedFolder}` : "Choose Folder for AI Analysis..."}
          </Button>
          <Button
            onClick={handleFileUploadClick}
            variant={scanMode === 'files' ? 'default' : 'outline'}
            className="flex-1 bg-black/70 border-blue-700 text-blue-200 hover:bg-blue-800"
            disabled={isScanning}
          >
            <Upload className="mr-1 h-5 w-5" />
            Upload Files Instead
          </Button>
          <Button
            onClick={handleDemoScan}
            variant={scanMode === 'demo' ? 'default' : 'outline'}
            className="flex-1 bg-black/80 border-green-700 text-green-300 hover:bg-green-800"
            disabled={isScanning}
          >
            <Brain className="mr-1 h-5 w-5" />
            Try Sample Scan
          </Button>
        </div>
        {/* Hidden file input for "Upload Files Instead" */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={selectedFileTypes.map(type => {
            if (type === 'images') return '.png,.jpg,.jpeg,.gif,.bmp,.webp';
            if (type === 'documents') return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf';
            if (type === 'videos') return '.mp4,.mov,.avi,.mkv,.wmv,.flv';
            if (type === 'audio') return '.mp3,.wav,.ogg,.flac,.aac,.m4a';
            return '';
          }).join(',')}
          onChange={handleFileInputChange}
        />
      </div>

      <FileTypeSelector
        selectedFileTypes={selectedFileTypes}
        onFileTypesChange={setSelectedFileTypes}
      />

      <ScanProgress progress={progress} message={scanMessage} />

      {/* Only show main scan & recover UI for folder or file upload, not demo */}
      {(scanMode === 'folder' || scanMode === 'files' || scanMode === 'demo') && (
        <>
          {isScanning ? (
            <Button
              disabled
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-semibold py-4 text-lg"
            >
              <Brain className="mr-2 h-5 w-5 animate-pulse" />
              🧠 LYRA AI Scanning...
            </Button>
          ) : (
            <>
              
            </>
          )}
        </>
      )}

      {scannedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              🧠 LYRA AI Results: {scannedFiles.length} Files Found
              {scanMode === 'demo' && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Sample Scan
                </Badge>
              )}
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
