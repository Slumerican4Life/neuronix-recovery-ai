
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, FileX, Lightning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecoveryFile {
  id: string;
  fileName: string;
  originalSize: string;
  recoveredSize: string;
  status: 'pending' | 'recovering' | 'recovered' | 'failed';
  progress: number;
}

export const RecoveryEngine = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryFiles, setRecoveryFiles] = useState<RecoveryFile[]>([
    { id: '1', fileName: 'vacation_photos.jpg', originalSize: '2.4 MB', recoveredSize: '0 MB', status: 'pending', progress: 0 },
    { id: '2', fileName: 'important_document.pdf', originalSize: '856 KB', recoveredSize: '0 MB', status: 'pending', progress: 0 },
    { id: '3', fileName: 'family_video.mp4', originalSize: '15.2 MB', recoveredSize: '0 MB', status: 'pending', progress: 0 },
  ]);
  const [lyraMessage, setLyraMessage] = useState('');
  const { toast } = useToast();

  const lyraMessages = [
    "Initiating recovery protocols... I'm analyzing the data fragments now.",
    "I've found intact headers for JPEG files. Reconstructing image data...",
    "PDF structure is partially corrupted, but I can rebuild the document tree.",
    "Video file recovery is complex, but I'm reassembling the codec streams.",
    "Recovery complete! I've successfully restored your precious memories.",
  ];

  const startRecovery = async () => {
    setIsRecovering(true);
    setLyraMessage(lyraMessages[0]);

    for (let i = 0; i < recoveryFiles.length; i++) {
      // Update file status to recovering
      setRecoveryFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'recovering' as const } : file
      ));

      setLyraMessage(lyraMessages[i + 1] || lyraMessages[lyraMessages.length - 1]);

      // Simulate recovery progress
      for (let progress = 0; progress <= 100; progress += 5) {
        setRecoveryFiles(prev => prev.map((file, index) => 
          index === i ? { 
            ...file, 
            progress,
            recoveredSize: progress === 100 ? file.originalSize : `${Math.round(parseFloat(file.originalSize) * progress / 100 * 100) / 100} ${file.originalSize.split(' ')[1]}`
          } : file
        ));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mark as recovered
      setRecoveryFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'recovered' as const } : file
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLyraMessage("All files have been successfully recovered and saved to your device!");
    setIsRecovering(false);
    
    toast({
      title: "Recovery completed successfully!",
      description: `${recoveryFiles.length} files have been restored`,
    });
  };

  const getStatusColor = (status: RecoveryFile['status']) => {
    switch (status) {
      case 'pending': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      case 'recovering': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'recovered': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lyra AI Assistant */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-6 w-6 text-purple-400" />
            Lyra AI Assistant
            <Lightning className="h-5 w-5 text-yellow-400 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
            <p className="text-purple-200 italic">
              {lyraMessage || "Hello! I'm Lyra, your AI recovery assistant. I'll guide you through the file recovery process and explain what's happening at each step."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Engine */}
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-6 w-6 text-yellow-400" />
            Neural Recovery Engine
            <FileX className="h-5 w-5 text-red-400" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={startRecovery}
              disabled={isRecovering}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-8"
            >
              {isRecovering ? (
                <>
                  <Lightning className="mr-2 h-4 w-4 animate-pulse" />
                  Recovering Files...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Recovery
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Recovery Queue ({recoveryFiles.length} files)
            </h3>
            
            <div className="space-y-3">
              {recoveryFiles.map((file) => (
                <div key={file.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-white truncate">{file.fileName}</div>
                    <Badge className={getStatusColor(file.status)}>
                      {file.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Original: {file.originalSize}</span>
                      <span>Recovered: {file.recoveredSize}</span>
                    </div>
                    
                    {file.status === 'recovering' && (
                      <div>
                        <Progress value={file.progress} className="h-2" />
                        <div className="text-xs text-slate-400 mt-1 text-center">
                          {file.progress}% complete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
