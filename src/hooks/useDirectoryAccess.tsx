
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useDirectoryAccess = () => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const { toast } = useToast();

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

  return { selectedFolder, setSelectedFolder, requestDirectoryAccess };
};
