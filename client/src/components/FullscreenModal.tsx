import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Wallpaper } from "@shared/schema";

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallpaper: Wallpaper | null;
}

export default function FullscreenModal({ isOpen, onClose, wallpaper }: FullscreenModalProps) {
  const handleDownload = async () => {
    if (!wallpaper) return;
    
    try {
      const response = await fetch(wallpaper.url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = wallpaper.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !wallpaper) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      data-testid="fullscreen-modal"
    >
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img 
          src={wallpaper.url} 
          alt={wallpaper.name}
          className="max-w-full max-h-full object-contain rounded shadow-2xl"
          data-testid="fullscreen-image"
          style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        />
        
        {/* Fullscreen Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            onClick={handleDownload}
            className="bg-gothic-blue hover:bg-blue-700 p-3 transition-all duration-300"
            data-testid="fullscreen-download"
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            onClick={onClose}
            className="bg-gothic-gray hover:bg-gothic-silver hover:text-gothic-black p-3 transition-all duration-300"
            data-testid="fullscreen-close"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Resolution Info */}
        <div className="absolute bottom-4 left-4 bg-gothic-black/80 px-4 py-2 rounded border border-gothic-gray">
          <span className="text-sm text-gothic-silver font-mono" data-testid="fullscreen-resolution">
            {wallpaper.width && wallpaper.height 
              ? `${wallpaper.width}×${wallpaper.height}` 
              : 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
}
