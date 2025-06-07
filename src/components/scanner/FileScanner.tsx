
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, FileX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScanResult {
  fileName: string;
  fileType: string;
  status: 'corrupted' | 'deleted' | 'recoverable' | 'healthy';
  size: string;
  damage: number;
}

export const FileScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentPhase, setCurrentPhase] = useState('');
  const { toast } = useToast();

  const mockScanResults: ScanResult[] = [
    { fileName: 'vacation_photos.jpg', fileType: 'JPEG', status: 'corrupted', size: '2.4 MB', damage: 35 },
    { fileName: 'important_document.pdf', fileType: 'PDF', status: 'deleted', size: '856 KB', damage: 0 },
    { fileName: 'family_video.mp4', fileType: 'MP4', status: 'recoverable', size: '15.2 MB', damage: 12 },
    { fileName: 'presentation.pptx', fileType: 'PowerPoint', status: 'corrupted', size: '4.1 MB', damage: 67 },
    { fileName: 'music_collection.mp3', fileType: 'MP3', status: 'recoverable', size: '3.8 MB', damage: 8 },
  ];

  const startScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);
    
    const phases = [
      'Initializing neural pathways...',
      'Scanning storage sectors...',
      'Analyzing file signatures...',
      'Detecting corruption patterns...',
      'Mapping recovery vectors...',
      'Building recovery matrix...',
      'Finalizing scan results...'
    ];

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(phases[i]);
      
      // Simulate scanning progress
      for (let progress = i * 100/7; progress < (i + 1) * 100/7; progress += 2) {
        setScanProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Add some results during scanning
      if (i === 3 || i === 5) {
        const newResults = mockScanResults.slice(i - 2, i + 1);
        setScanResults(prev => [...prev, ...newResults]);
      }
    }

    setScanProgress(100);
    setScanResults(mockScanResults);
    setCurrentPhase('Scan complete');
    setIsScanning(false);
    
    toast({
      title: "Deep scan completed",
      description: `Found ${mockScanResults.length} files requiring attention`,
    });
  }, [toast]);

  const getStatusColor = (status: ScanResult['status']) => {
    switch (status) {
      case 'corrupted': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'deleted': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'recoverable': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'healthy': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-6 w-6 text-purple-400" />
          Neural File Scanner
          <Zap className="h-5 w-5 text-yellow-400" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Button
            onClick={startScan}
            disabled={isScanning}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8"
          >
            {isScanning ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Scanning...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Start Deep Scan
              </>
            )}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-purple-400 font-medium mb-2">{currentPhase}</div>
              <Progress value={scanProgress} className="h-3" />
              <div className="text-sm text-slate-400 mt-1">{Math.round(scanProgress)}% complete</div>
            </div>
          </div>
        )}

        {scanResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileX className="h-5 w-5 text-red-400" />
              Scan Results ({scanResults.length} files)
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {scanResults.map((result, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white truncate">{result.fileName}</div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>{result.fileType} • {result.size}</span>
                    {result.damage > 0 && (
                      <span className="text-red-400">{result.damage}% damaged</span>
                    )}
                  </div>
                  
                  {result.damage > 0 && (
                    <div className="mt-2">
                      <Progress value={result.damage} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
