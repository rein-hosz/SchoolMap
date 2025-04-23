import { useRef, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sekolah } from "@/types/school";
import LayerSwitcher, { MapLayerType, MAP_LAYERS } from "./LayerSwitcher";
import SchoolPopup from "./SchoolPopup";
import SchoolSearch from "./SchoolSearch";
import LocationControl from "./LocationControl";

// Create marker icons after import
const defaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redMarkerIcon = L.icon({
  iconUrl: "/marker/marker-icon-red.png",
  iconRetinaUrl: "/marker/marker-icon-2x-red.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Add MapController component to handle map reference
function MapController({ map }: { map: L.Map | null }) {
  const leafletMap = useMap();

  useEffect(() => {
    if (map === null) {
      leafletMap.setView([3.5952, 98.6722], 13);
    }
  }, [map, leafletMap]);

  return null;
}

export default function Map({ data }: { data: Sekolah[] }) {
  const [mapLayer, setMapLayer] = useState<MapLayerType>("osm");
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);

  useEffect(() => {
    // Initialize leaflet
    if (typeof window !== "undefined") {
      // Set default icon for all markers
      L.Marker.prototype.options.icon = defaultIcon;

      // Add location found event handler
      if (mapRef.current) {
        // Remove any existing handlers to prevent duplicates
        mapRef.current.off("locationfound");
        mapRef.current.off("locationerror");

        mapRef.current.on("locationfound", (e) => {
          console.log("Location found:", e.latlng);
          setUserLocation(e.latlng);
        });

        mapRef.current.on("locationerror", (error) => {
          console.error("Location error:", error.message);
        });
      }
    }

    // Cleanup function to remove event handlers
    return () => {
      if (mapRef.current) {
        mapRef.current.off("locationfound");
        mapRef.current.off("locationerror");
      }
    };
  }, []);

  const handleSchoolSelect = useCallback((school: Sekolah) => {
    if (mapRef.current) {
      mapRef.current.setView([school.lat, school.lng], 16);
      setSelectedSchool(school);
    }
  }, []);

  const handleSearchReset = useCallback(() => {
    setSelectedSchool(null);
    if (mapRef.current) {
      mapRef.current.setView([3.5952, 98.6722], 13);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <SchoolSearch
        data={data}
        onSchoolSelect={handleSchoolSelect}
        onSearchReset={handleSearchReset}
      />
      <LayerSwitcher currentLayer={mapLayer} onLayerChange={setMapLayer} />

      <MapContainer
        center={[3.5952, 98.6722]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0 [&_.leaflet-popup-content-wrapper]:bg-neutral-900/95 [&_.leaflet-popup-content-wrapper]:backdrop-blur-xl 
          [&_.leaflet-popup-content-wrapper]:text-white [&_.leaflet-popup-content-wrapper]:shadow-2xl 
          [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-neutral-800/50 
          [&_.leaflet-popup-tip]:bg-neutral-900/95"
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <MapController map={mapRef.current} />
        <TileLayer
          url={MAP_LAYERS[mapLayer].url}
          attribution={MAP_LAYERS[mapLayer].attribution}
          {...(MAP_LAYERS[mapLayer].subdomains && {
            subdomains: MAP_LAYERS[mapLayer].subdomains,
          })}
        />
        {data.map((sekolah) =>
          selectedSchool === null || selectedSchool.id === sekolah.id ? (
            <Marker
              key={sekolah.id}
              position={[sekolah.lat, sekolah.lng]}
              icon={
                selectedSchool?.id === sekolah.id ? redMarkerIcon : defaultIcon
              }
              eventHandlers={{
                click: () => {
                  setSelectedSchool(sekolah);
                },
                popupclose: () => {
                  setSelectedSchool(null);
                },
              }}
            >
              <SchoolPopup school={sekolah} />
            </Marker>
          ) : null
        )}

        <LocationControl />

        {userLocation && (
          <Marker position={userLocation} icon={locationIcon}>
            <SchoolPopup
              school={{
                id: 0,
                nama: "Your Location",
                alamat: `${userLocation.lat.toFixed(
                  6
                )}, ${userLocation.lng.toFixed(6)}`,
                npsn: "",
                status: "",
                bentuk_pendidikan: "",
                akreditasi: "",
                jumlah_guru: 0,
                jumlah_murid: 0,
                lat: userLocation.lat,
                lng: userLocation.lng,
              }}
            />
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
