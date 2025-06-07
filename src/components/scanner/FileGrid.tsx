
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Image, Video, Music, Archive, AlertTriangle, Download, Eye } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

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

interface FileGridProps {
  files: ScannedFile[];
  onFileToggle: (fileId: string) => void;
  guestMode?: boolean;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onFileToggle, guestMode = false }) => {
  const getFileIcon = (type: string) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'].includes(type.toLowerCase())) {
      return Image;
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'].includes(type.toLowerCase())) {
      return Video;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(type.toLowerCase())) {
      return Music;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type.toLowerCase())) {
      return Archive;
    }
    if (['exe', 'msi', 'apk', 'dmg', 'deb'].includes(type.toLowerCase())) {
      return AlertTriangle;
    }
    return FileText;
  };

  const getDamageColor = (damage: string) => {
    switch (damage) {
      case 'none': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'minor': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'moderate': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'severe': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'SENTINEL': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'SPECTRA-X': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'QUILL-X': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handlePreview = (file: ScannedFile) => {
    if (file.file && file.thumbnail) {
      // Create a modal or new window to show the file preview
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Preview: ${file.name}</title></head>
            <body style="margin:0;padding:20px;background:#000;color:#fff;font-family:Arial,sans-serif;">
              <h2>File Preview</h2>
              <p><strong>Name:</strong> ${file.name}</p>
              <p><strong>Size:</strong> ${formatBytes(file.size)}</p>
              <p><strong>Type:</strong> ${file.type.toUpperCase()}</p>
              ${file.thumbnail ? `<img src="${file.thumbnail}" style="max-width:100%;height:auto;border:1px solid #333;"/>` : ''}
            </body>
          </html>
        `);
      }
    }
  };

  const selectedCount = files.filter(f => f.recovered).length;
  const freeLimit = guestMode ? 5 : Infinity;
  const canSelectMore = selectedCount < freeLimit;

  return (
    <div className="space-y-4">
      {guestMode && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-400 text-sm">
            Free trial: {selectedCount}/{freeLimit} files selected for recovery.
            {!canSelectMore && " Upgrade for unlimited recovery."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {files.map((file) => {
          const IconComponent = getFileIcon(file.type);
          const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(file.type.toLowerCase());

          return (
            <Card key={file.id} className="bg-black/60 border-gray-600 p-3 hover:border-purple-500/50 transition-colors">
              <div className="space-y-2">
                {/* File Preview/Icon - Small 64px thumbnail */}
                <div className="relative">
                  {file.thumbnail && isImage ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded bg-gray-800 mx-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Preview Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-0 right-0 bg-black/60 hover:bg-black/80 p-1 h-6 w-6"
                    onClick={() => handlePreview(file)}
                  >
                    <Eye className="h-3 w-3 text-white" />
                  </Button>
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <div>
                    <h4 className="text-white text-xs font-medium truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {formatBytes(file.size)}
                    </p>
                    <p className="text-gray-500 text-xs truncate" title={file.path}>
                      {file.path}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    <Badge className={`${getDamageColor(file.damage)} text-xs`} variant="outline">
                      {file.damage === 'none' ? 'Perfect' : file.damage}
                    </Badge>
                    <Badge className={`${getAgentColor(file.agent)} text-xs`} variant="outline">
                      {file.agent}
                    </Badge>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Checkbox
                        id={file.id}
                        checked={file.recovered}
                        onCheckedChange={() => {
                          if (!file.recovered && !canSelectMore) return;
                          onFileToggle(file.id);
                        }}
                        disabled={!file.recovered && !canSelectMore}
                      />
                      <label htmlFor={file.id} className="text-white text-xs">
                        Recover
                      </label>
                    </div>

                    {file.recovered && (
                      <Download className="h-3 w-3 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
