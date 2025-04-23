import { useState } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import { FaLocationDot } from "react-icons/fa6";
import { IoExpand, IoContract } from "react-icons/io5";
import L from "leaflet";

// Create a location icon for the marker
const locationIcon = L.icon({
  iconUrl: "/marker/location.png", // This should match your existing file
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function LocationControl() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const map = useMap();

  const handleLocationClick = () => {
    setIsLocating(true);

    // Remove any existing event handlers to prevent duplicates
    map.off("locationfound");
    map.off("locationerror");

    // Add location found event handler
    map.on("locationfound", (e) => {
      setIsLocating(false);
      const { lat, lng } = e.latlng;
      setUserPosition([lat, lng]);
      console.log("Location found in LocationControl:", lat, lng);
    });

    // Add location error handler
    map.on("locationerror", (e) => {
      setIsLocating(false);
      setUserPosition(null);
      console.error("Location error:", e.message);
      alert(
        "Could not find your location. Please make sure location services are enabled."
      );
    });

    // Use locate method to find user location
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
    });
  };

  return (
    <>
      <div
        className={`absolute bottom-8 right-8 z-[1000] bg-white/90 backdrop-blur-md rounded-lg shadow-lg border 
        border-neutral-200 transition-all duration-300 overflow-hidden
        ${isExpanded ? "w-48" : "w-10"}`}
      >
        <div className="flex items-center">
          <button
            onClick={handleLocationClick}
            className="p-2.5 hover:bg-neutral-100 transition-colors relative group flex-1"
          >
            <FaLocationDot
              className={`w-5 h-5 transition-colors
              ${
                isLocating
                  ? "text-blue-500 animate-pulse"
                  : "text-neutral-700 group-hover:text-neutral-900"
              }`}
            />
            {isExpanded && (
              <span className="ml-3 text-sm text-neutral-700 group-hover:text-neutral-900">
                Find My Location
              </span>
            )}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 hover:bg-neutral-100 transition-colors border-l border-neutral-200"
          >
            {isExpanded ? (
              <IoContract className="w-5 h-5 text-neutral-700 hover:text-neutral-900" />
            ) : (
              <IoExpand className="w-5 h-5 text-neutral-700 hover:text-neutral-900" />
            )}
          </button>
        </div>
      </div>

      {userPosition && (
        <Marker position={userPosition} icon={locationIcon}>
          <Popup>
            <div className="font-medium">Your Location</div>
            <div className="text-sm text-neutral-500">
              {userPosition[0].toFixed(6)}, {userPosition[1].toFixed(6)}
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
}
