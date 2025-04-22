import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Sekolah } from "@/types/school";
import LayerSwitcher, { MapLayerType, MAP_LAYERS } from "./LayerSwitcher";
import SchoolPopup from "./SchoolPopup";

// Fix Leaflet's icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function Map({ data }: { data: Sekolah[] }) {
  const [mapLayer, setMapLayer] = useState<MapLayerType>('osm');

  return (
    <div className="w-full h-full relative">
      <LayerSwitcher currentLayer={mapLayer} onLayerChange={setMapLayer} />

      <MapContainer
        center={[3.5952, 98.6722]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0 [&_.leaflet-popup-content-wrapper]:bg-neutral-900/95 [&_.leaflet-popup-content-wrapper]:backdrop-blur-xl [&_.leaflet-popup-content-wrapper]:text-white [&_.leaflet-popup-content-wrapper]:shadow-2xl [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-neutral-800/50 [&_.leaflet-popup-tip]:bg-neutral-900/95"
      >
        <TileLayer
          url={MAP_LAYERS[mapLayer].url}
          attribution={MAP_LAYERS[mapLayer].attribution}
          {...(MAP_LAYERS[mapLayer].subdomains && { subdomains: MAP_LAYERS[mapLayer].subdomains })}
        />
        {data.map((sekolah) => (
          <Marker key={sekolah.id} position={[sekolah.lat, sekolah.lng]}>
            <SchoolPopup school={sekolah} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}