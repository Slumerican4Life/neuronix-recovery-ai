
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { help } from "lucide-react"; // Import proper icon node
import { Icon } from "lucide-react"; // To render icon nodes

export const FolderAccessHelpDialog: React.FC = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 text-purple-400 hover:text-purple-300 flex items-center gap-1"
        aria-label="Help with Folder Access"
      >
        <Icon iconNode={help} className="h-4 w-4" />
        Help
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>How to Grant Folder Access</DialogTitle>
        <DialogDescription>
          To scan your files, you need to grant this app permission to a folder.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 text-sm text-gray-800">
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Click the <span className="font-semibold">"Choose Folder for AI Analysis..."</span> button.
          </li>
          <li>
            In the dialog window that appears, select the folder you wish to scan and click <span className="font-semibold">"Select Folder"</span> or <span className="font-semibold">"Open"</span>.
          </li>
          <li>
            If prompted, give this site permission to access the folder.
          </li>
        </ol>
        <p className="mt-2">
          <span className="font-semibold text-purple-600">Tip:</span> If you accidentally denied permission, refresh the page and try again.<br/>
          <span className="font-semibold text-purple-600">Supported browsers:</span> Chrome, Edge, Brave, and other Chromium browsers.
        </p>
        <ul className="mt-2 list-disc list-inside">
          <li>
            <b>If nothing happens:</b> Make sure your browser supports the File System Access API.
          </li>
          <li>
            <b>If you see a "Browser not supported" message:</b> Try Chrome or Edge, and avoid using Incognito/Private mode.
          </li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);
