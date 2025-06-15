
export const generateThumbnail = async (file: File): Promise<string | undefined> => {
  if (!file.type.startsWith('image/')) return undefined;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(undefined);
        
        canvas.width = 128;
        canvas.height = 128;
        
        const aspectRatio = img.width / img.height;
        let drawWidth = 128;
        let drawHeight = 128;
        let offsetX = 0;
        let offsetY = 0;
        
        if (aspectRatio > 1) {
          drawHeight = 128 / aspectRatio;
          offsetY = (128 - drawHeight) / 2;
        } else {
          drawWidth = 128 * aspectRatio;
          offsetX = (128 - drawWidth) / 2;
        }
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, 128, 128);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
