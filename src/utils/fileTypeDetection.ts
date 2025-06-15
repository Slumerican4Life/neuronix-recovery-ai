
export const detectFileType = (extension: string, selectedFileTypes: string[]): boolean => {
  return selectedFileTypes.some(type => {
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
};

export const getAgentForFile = (extension: string): 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' => {
  if (['jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'webm'].includes(extension)) {
    return 'SPECTRA-X';
  } else if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx', 'csv'].includes(extension)) {
    return 'QUILL-X';
  }
  return 'SENTINEL';
};
