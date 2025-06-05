import {
  FaExpand,
  FaCompress,
  FaCrosshairs,
  FaLayerGroup,
} from "react-icons/fa";

interface MobileControlsProps {
  onLocationCenter?: () => void;
  onLayerToggle?: () => void;
  onFullscreenToggle?: () => void;
  isFullscreen?: boolean;
  showControls?: boolean;
}

export default function MobileControls({
  onLocationCenter,
  onLayerToggle,
  onFullscreenToggle,
  isFullscreen = false,
  showControls = true,
}: MobileControlsProps) {
  if (!showControls) return null;

  return (
    <>
      {" "}
      {/* Mobile Control Panel - Bottom left, vertical stack */}
      <div className="md:hidden fixed bottom-4 left-4 z-[1000] flex flex-col gap-2">
        {/* Location Center Button */}
        {onLocationCenter && (
          <button
            onClick={onLocationCenter}
            className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md shadow-lg 
              flex items-center justify-center transition-all duration-200 
              hover:bg-white active:scale-95 border border-neutral-200/60
              hover:shadow-xl touch-manipulation"
            aria-label="Center on my location"
          >
            <FaCrosshairs className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* Layer Toggle Button */}
        {onLayerToggle && (
          <button
            onClick={onLayerToggle}
            className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md shadow-lg 
              flex items-center justify-center transition-all duration-200 
              hover:bg-white active:scale-95 border border-neutral-200/60
              hover:shadow-xl touch-manipulation"
            aria-label="Toggle map layers"
          >
            <FaLayerGroup className="w-4 h-4 text-emerald-600" />
          </button>
        )}

        {/* Fullscreen Toggle Button */}
        {onFullscreenToggle && (
          <button
            onClick={onFullscreenToggle}
            className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md shadow-lg 
              flex items-center justify-center transition-all duration-200 
              hover:bg-white active:scale-95 border border-neutral-200/60
              hover:shadow-xl touch-manipulation"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <FaCompress className="w-4 h-4 text-purple-600" />
            ) : (
              <FaExpand className="w-4 h-4 text-purple-600" />
            )}
          </button>
        )}
      </div>
    </>
  );
}
