import { Popup } from "react-leaflet";
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";

interface LocationPopupProps {
  location: L.LatLng;
}

export default function LocationPopup({ location }: LocationPopupProps) {
  return (
    <Popup>
      <div className="text-sm font-sans -mx-3 -my-2 rounded-xl min-w-[280px]">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 -mt-2 -mx-2 rounded-t-lg relative">
          <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-medium bg-black/20 text-white rounded-bl-lg">
            Current Position
          </div>
          <h2 className="font-bold text-base text-white leading-tight pr-12 flex items-center gap-2">
            <FaLocationDot className="text-blue-300" /> Your Location
          </h2>
        </div>
        
        <div className="p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-neutral-400">Latitude</div>
              <div className="font-medium">{location.lat.toFixed(6)}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Longitude</div>
              <div className="font-medium">{location.lng.toFixed(6)}</div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-800/50">
            <div className="text-xs text-neutral-400 mb-1">Coordinates</div>
            <div className="px-3 py-2 bg-neutral-800/30 rounded-md text-sm font-mono">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
}