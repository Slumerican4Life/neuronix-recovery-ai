
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useDirectoryAccess = () => {
  const [selectedFolder, setSelectedFolder] = useState('');
  const { toast } = useToast();

  const requestDirectoryAccess = async () => {
    try {
      if (!('showDirectoryPicker' in window)) {
        toast({
          title: "Browser Not Supported",
          description: "This feature requires a modern browser like Chrome or Edge. Please switch browsers to scan folders.",
          variant: "destructive"
        });
        return null;
      }
      
      // @ts-ignore - File System Access API
      const dirHandle = await window.showDirectoryPicker({
        id: 'neuronix-recovery-scan',
        mode: 'readwrite',
      });
      setSelectedFolder(dirHandle.name);
      return dirHandle;

    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'AbortError') {
          // User cancelled the folder picker. This is normal, so no toast is needed.
          console.log("User cancelled the folder picker.");
        } else if (error.name === 'NotAllowedError') {
          toast({
            title: "Permission Required",
            description: "Access was not granted. Please allow folder access to proceed. You may need to reset site permissions in your browser settings if you've previously blocked it.",
            variant: "destructive"
          });
        } else {
            toast({
                title: "An Unexpected Error Occurred",
                description: `Could not access the folder. Error: ${error.message}`,
                variant: "destructive"
            });
        }
      } else {
        // Fallback for other unexpected errors
        toast({
          title: "Access Denied",
          description: "Please grant folder access to perform a deep scan. Try again and allow the permission when prompted.",
          variant: "destructive"
        });
        console.error("An unknown error occurred during directory access:", error);
      }
      return null;
    }
  };

  return { selectedFolder, setSelectedFolder, requestDirectoryAccess };
};
