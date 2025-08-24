import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsUnlocking(true);
        setTimeout(() => {
          onUnlock();
        }, 800);
      }
    };

    const handleMouseMove = () => handleInteraction();
    const handleMouseDown = () => handleInteraction();
    const handleKeyDown = () => handleInteraction();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasInteracted, onUnlock]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gothic-gradient ${
        isUnlocking ? 'animate-unlock' : ''
      }`}
      data-testid="lock-screen"
    >
      <div className="text-center">
        {/* Gothic lock icon with dramatic shadow */}
        <div className="mb-8">
          <Lock className="w-32 h-32 mx-auto text-gothic-silver drop-shadow-2xl" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gothic-silver tracking-wider text-shadow">
          WALLPAPERS - HEXY
        </h1>
        
        <p className="text-xl text-gothic-silver/80 mb-8 font-light tracking-wide">
          Move your mouse to unlock the gallery
        </p>
        
        {/* Gothic ornamental border */}
        <div className="w-64 h-1 bg-gradient-to-r from-transparent via-gothic-silver to-transparent mx-auto"></div>
      </div>
      
      {/* Ambient gothic texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 bg-gothic-texture bg-texture"
        data-testid="texture-overlay"
      />
    </div>
  );
}
