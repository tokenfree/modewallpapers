import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import WallpaperGallery from "@/components/WallpaperGallery";
import InfoPanel from "@/components/InfoPanel";
import FullscreenModal from "@/components/FullscreenModal";
import type { Wallpaper } from "@shared/schema";

export default function Home() {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const { data: wallpapers = [] } = useQuery<Wallpaper[]>({
    queryKey: ['/api/wallpapers'],
  });

  const handleSelectWallpaper = (wallpaper: Wallpaper, index: number) => {
    setSelectedWallpaper(wallpaper);
    setIsInfoPanelOpen(true);
  };

  useEffect(() => {
    // Prevent body scroll when modals are open
    if (isFullscreenOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreenOpen]);

  return (
    <div className="min-h-screen bg-gothic-gradient text-gothic-silver" data-testid="home-page">
      {/* Gothic Header */}
      <header className="bg-gradient-to-r from-gothic-black via-gothic-charcoal to-gothic-black border-b border-gothic-gray shadow-2xl fixed w-full top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/favicon.ico" alt="Hexy Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gothic-silver tracking-wider text-shadow">
                Wallpapers - Hexy
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                className="gothic-button"
                data-testid="toggle-info-panel"
              >
                <Info className="w-4 h-4 mr-2" />
                Info Panel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex pt-20">
        {/* Gallery Section */}
        <main className={`flex-1 p-6 overflow-y-auto transition-all duration-500 ${
          isInfoPanelOpen ? 'mr-80' : 'mr-0'
        }`}>
          <div className="max-w-6xl mx-auto">
            <WallpaperGallery onSelectWallpaper={handleSelectWallpaper} />
          </div>
        </main>

        {/* Info Panel */}
        <InfoPanel
          isOpen={isInfoPanelOpen}
          onClose={() => setIsInfoPanelOpen(false)}
          selectedWallpaper={selectedWallpaper}
          wallpapers={wallpapers}
          onSelectWallpaper={handleSelectWallpaper}
          onOpenFullscreen={() => setIsFullscreenOpen(true)}
        />
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        wallpaper={selectedWallpaper}
      />
    </div>
  );
}
