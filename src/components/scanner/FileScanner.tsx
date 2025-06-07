import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Scan, Brain, Zap, FileText, Image, Music, Video, AlertTriangle } from 'lucide-react';

interface ScanResult {
  fileType: string;
  filesScanned: number;
  corruptedFiles: number;
  recoveryRate: number;
}

export const FileScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Ready to scan for corrupted files.');

  const handleScan = async () => {
    setIsScanning(true);
    setScanResults(null);
    setProgress(0);
    setScanMessage('Starting scan...');

    // Simulate scanning process
    const totalSteps = 100;
    const interval = 50; // milliseconds

    let currentStep = 0;
    const scanInterval = setInterval(() => {
      currentStep += 1;
      const currentProgress = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 30) {
        setScanMessage('Analyzing file system...');
      } else if (currentProgress < 60) {
        setScanMessage('Identifying potentially corrupted files...');
      } else if (currentProgress < 90) {
        setScanMessage('Isolating damaged sectors...');
      } else {
        setScanMessage('Finalizing scan...');
      }

      if (currentStep >= totalSteps) {
        clearInterval(scanInterval);
        setIsScanning(false);
        setScanMessage('Scan complete!');

        // Simulate scan results
        setScanResults({
          fileType: 'Documents & Media',
          filesScanned: 482,
          corruptedFiles: 2,
          recoveryRate: 99.8
        });
      }
    }, interval);
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Scan className="h-6 w-6 text-purple-400" />
          File System Scanner
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-slate-300">
            {scanMessage}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
        >
          {isScanning ? (
            <>
              <Zap className="mr-2 h-4 w-4 animate-pulse" />
              Scanning...
            </>
          ) : (
            <>
              <Scan className="mr-2 h-4 w-4" />
              Start Scan
            </>
          )}
        </Button>

        {scanResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">File Type:</span>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                {scanResults.fileType}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-300" />
                  Files Scanned:
                </div>
                <div className="text-lg font-semibold text-blue-400">{scanResults.filesScanned}</div>
              </div>

              <div>
                <div className="text-sm text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-300" />
                  Corrupted Files:
                </div>
                <div className="text-lg font-semibold text-orange-400">{scanResults.corruptedFiles}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-2">
                <Brain className="h-4 w-4 text-green-300" />
                Recovery Rate:
              </span>
              <span className="text-green-400 font-semibold">{scanResults.recoveryRate}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
