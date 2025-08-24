import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Wallpaper } from "@shared/schema";

interface WallpaperGalleryProps {
  onSelectWallpaper: (wallpaper: Wallpaper, index: number) => void;
}

export default function WallpaperGallery({ onSelectWallpaper }: WallpaperGalleryProps) {
  const { data: wallpapers = [], isLoading } = useQuery<Wallpaper[]>({
    queryKey: ['/api/wallpapers'],
  });

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="gothic-card overflow-hidden">
            <Skeleton className="w-full h-48 bg-gothic-gray" />
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2 bg-gothic-gray" />
              <Skeleton className="h-3 w-1/2 bg-gothic-gray" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Gallery Stats */}
      <div className="mb-6 p-4 gothic-card rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gothic-silver" data-testid="wallpaper-count">
              {wallpapers.length}
            </div>
            <div className="text-sm text-gothic-silver/70">Total Wallpapers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gothic-silver">Free</div>
            <div className="text-sm text-gothic-silver/70">Downloads</div>
          </div>
        </div>
      </div>

      {/* Wallpaper Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-testid="wallpaper-grid">
        {wallpapers.map((wallpaper, index) => (
          <div 
            key={wallpaper.id}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => onSelectWallpaper(wallpaper, index)}
            data-testid={`wallpaper-card-${index}`}
          >
            <Card className="gothic-card overflow-hidden group-hover:shadow-2xl transition-all duration-300">
              <img 
                src={wallpaper.url} 
                alt={wallpaper.name}
                className="w-full h-48 object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono text-gothic-silver group-hover:text-white transition-colors truncate">
                    {wallpaper.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(wallpaper.url, wallpaper.name);
                    }}
                    className="text-gothic-silver/50 group-hover:text-gothic-silver transition-colors p-1"
                    data-testid={`download-button-${index}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gothic-silver/50 mt-1 font-mono">
                  {wallpaper.width && wallpaper.height 
                    ? `${wallpaper.width}×${wallpaper.height}` 
                    : 'HD'}
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
