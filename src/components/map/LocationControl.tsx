import { useState, useEffect, useCallback, useRef } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";
import { IoExpand, IoContract } from "react-icons/io5";
import { saveUserLocation } from "@/lib/location";
import { useLocation } from "@/contexts/LocationContext";

// Custom icon for user location
const locationIcon = new L.Icon({
  iconUrl: "/marker/location.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LocationControlProps {
  onLocationUpdate?: (location: L.LatLng) => void;
}

export default function LocationControl({ onLocationUpdate }: LocationControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const map = useMap();
  const { userLocation, setUserLocation } = useLocation();
  const locationWatchId = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationWatchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(locationWatchId.current);
        locationWatchId.current = null;
      }
    };
  }, []);

  const handleLocationClick = useCallback(() => {
    setIsLocating(true);

    // Try to use the Geolocation API directly first for faster response
    if (navigator.geolocation) {
      // First try to get a quick position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = new L.LatLng(latitude, longitude);
          
          // Update state and map
          map.setView(latLng, 16);
          
          // Save location
          setUserLocation(latLng);
          
          if (onLocationUpdate) {
            onLocationUpdate(latLng);
          }
          
          // Also save to API in background
          saveUserLocation(latLng).catch(error => {
            console.error("Failed to save location to API:", error);
          });
          
          // Continue watching for more accurate updates
          if (locationWatchId.current === null) {
            locationWatchId.current = navigator.geolocation.watchPosition(
              (watchPosition) => {
                const { latitude, longitude } = watchPosition.coords;
                const watchLatLng = new L.LatLng(latitude, longitude);
                
                setUserLocation(watchLatLng);
                
                if (onLocationUpdate) {
                  onLocationUpdate(watchLatLng);
                }
              },
              (error) => {
                console.error("Watch position error:", error.message);
              },
              { 
                enableHighAccuracy: true,
                maximumAge: 30000, // 30 seconds
                timeout: 27000 // 27 seconds
              }
            );
          }
          
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          
          // Fall back to Leaflet's locate method if direct geolocation fails
          fallbackToLeafletLocate();
        },
        {
          enableHighAccuracy: false, // Start with lower accuracy for speed
          maximumAge: 60000, // Accept positions up to 1 minute old
          timeout: 5000 // Wait only 5 seconds for quick response
        }
      );
    } else {
      // Fall back to Leaflet's locate method if geolocation is not available
      fallbackToLeafletLocate();
    }
  }, [map, onLocationUpdate, setUserLocation]);

  // Fallback to Leaflet's locate method
  const fallbackToLeafletLocate = () => {
    // Remove any existing event handlers to prevent duplicates
    map.off("locationfound");
    map.off("locationerror");

    // Add location found event handler
    map.on("locationfound", (e) => {
      setIsLocating(false);
      const { lat, lng } = e.latlng;
      
      // Save to context
      setUserLocation(e.latlng);
      
      // Notify parent component
      if (onLocationUpdate) {
        onLocationUpdate(e.latlng);
      }
      
      // Save to API in background
      saveUserLocation(e.latlng).catch(error => {
        console.error("Failed to save location to API:", error);
      });
    });

    // Add location error handler
    map.on("locationerror", (e) => {
      setIsLocating(false);
      console.error("Location error:", e.message);
      alert("Could not find your location. Please make sure location services are enabled.");
    });

    // Use locate method to find user location
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
    });
  };

  return (
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
  );
}
