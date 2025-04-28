import { createElement, useState } from "react";
import { FaSatellite, FaMap } from "react-icons/fa";
import { FaEarthAsia } from "react-icons/fa6";
import { IconType } from "react-icons";

// Define a type for map layers to include subdomains
export interface MapLayerType {
  name: string;
  icon: IconType;
  url: string;
  attribution: string;
  subdomains?: string[] | string;
}

// Then ensure MAP_LAYERS is typed correctly
export const MAP_LAYERS: Record<string, MapLayerType> = {
  osm: {
    name: "OpenStreetMap",
    icon: FaEarthAsia,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    subdomains: ["a", "b", "c"],
  },
  esri: {
    name: "Esri Satellite",
    icon: FaSatellite,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  esriStreets: {
    name: "Esri Streets",
    icon: FaMap,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
} as const;

export type MapLayerKey = keyof typeof MAP_LAYERS;

interface LayerSwitcherProps {
  currentLayer: MapLayerKey;
  onLayerChange: (layer: MapLayerKey) => void;
}

export default function LayerSwitcher({
  currentLayer,
  onLayerChange,
}: LayerSwitcherProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="absolute bottom-8 left-8 z-[1000] bg-white/90 backdrop-blur-md p-2.5 rounded-lg shadow-lg border border-neutral-200 
          transition-all duration-300 hover:bg-white hover:shadow-xl w-10 h-10 flex items-center justify-center"
        aria-label="Change map layer"
      >
        {createElement(MAP_LAYERS[currentLayer].icon, {
          className:
            "w-5 h-5 text-neutral-700 group-hover:text-neutral-900 transition-colors",
        })}
      </button>

      {showMenu && (
        <div
          className="absolute bottom-24 left-8 z-[1000] bg-white/95 backdrop-blur-md rounded-lg shadow-lg border 
          border-neutral-200 p-2 space-y-1 min-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {Object.entries(MAP_LAYERS).map(([key, layer]) => {
            const Icon = layer.icon;
            return (
              <button
                key={key}
                onClick={() => {
                  onLayerChange(key as MapLayerKey);
                  setShowMenu(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left rounded-md transition-all duration-200 flex items-center gap-3
                  ${
                    currentLayer === key
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900"
                  }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    currentLayer === key ? "text-white" : "text-neutral-500"
                  }`}
                />
                {layer.name}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
