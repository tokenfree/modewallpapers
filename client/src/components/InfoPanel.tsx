import { useState } from "react";
import { X, Download, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Wallpaper } from "@shared/schema";

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWallpaper: Wallpaper | null;
  wallpapers: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper, index: number) => void;
  onOpenFullscreen: () => void;
}

export default function InfoPanel({ 
  isOpen, 
  onClose, 
  selectedWallpaper, 
  wallpapers,
  onSelectWallpaper,
  onOpenFullscreen 
}: InfoPanelProps) {
  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };



  const formatResolution = (width: number | null, height: number | null) => {
    if (!width || !height) return 'Unknown';
    return `${width}×${height}`;
  };

  return (
    <aside 
      className={`w-80 bg-gradient-to-b from-gothic-charcoal to-gothic-black border-l border-gothic-gray 
        transform transition-transform duration-500 overflow-y-auto fixed right-0 top-0 h-full z-30
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      data-testid="info-panel"
    >
      <div className="p-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gothic-silver tracking-wider">
            WALLPAPER INFO
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gothic-silver hover:text-white transition-colors"
            data-testid="close-info-panel"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Selected Image Info */}
        {selectedWallpaper && (
          <div data-testid="selected-wallpaper-info">
            {/* Preview */}
            <div className="mb-6">
              <img 
                src={selectedWallpaper.url} 
                alt={selectedWallpaper.name}
                className="w-full h-40 object-cover rounded border border-gothic-gray shadow-lg"
                data-testid="preview-image"
              />
            </div>

            {/* Image Details */}
            <div className="space-y-4">
              <Card className="bg-gothic-black/50 p-4 border border-gothic-gray">
                <h3 className="text-sm font-mono text-gothic-silver/70 uppercase tracking-wider mb-2">
                  File Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gothic-silver/70">Name:</span>
                    <span className="text-sm text-white font-mono truncate max-w-32" data-testid="file-name">
                      {selectedWallpaper.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gothic-silver/70">Format:</span>
                    <span className="text-sm text-white font-mono uppercase" data-testid="file-format">
                      {selectedWallpaper.format}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gothic-silver/70">Resolution:</span>
                    <span className="text-sm text-white font-mono" data-testid="file-resolution">
                      {formatResolution(selectedWallpaper.width, selectedWallpaper.height)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleDownload(selectedWallpaper.url, selectedWallpaper.name)}
                  className="flex-1 bg-gothic-blue hover:bg-blue-700 border-gothic-blue transition-all duration-300"
                  data-testid="download-selected"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={onOpenFullscreen}
                  className="flex-1 bg-gothic-gray hover:bg-gothic-silver hover:text-gothic-black border border-gothic-silver/30 transition-all duration-300"
                  data-testid="fullscreen-selected"
                >
                  <Expand className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>

              {/* Description */}
              {selectedWallpaper.description && (
                <Card className="bg-gothic-black/50 p-4 border border-gothic-gray">
                  <h3 className="text-sm font-mono text-gothic-silver/70 uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gothic-silver/80" data-testid="wallpaper-description">
                    {selectedWallpaper.description}
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
