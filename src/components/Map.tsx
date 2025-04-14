"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

type Sekolah = {
  id: number;
  nama: string;
  npsn: string;
  alamat: string;
  status: string;
  bentuk_pendidikan: string;
  akreditasi: string;
  jumlah_guru: number;
  jumlah_murid: number;
  lat: number;
  lng: number;
};

// Add color mapping constants
const SCHOOL_COLORS = {
  'SD': {
    base: "bg-blue-600",
    light: "bg-blue-500/20 text-blue-300",
    number: "text-blue-400",
  },
  'SMP': {
    base: "bg-emerald-600",
    light: "bg-emerald-500/20 text-emerald-300",
    number: "text-emerald-400",
  },
  'SMA': {
    base: "bg-purple-600",
    light: "bg-purple-500/20 text-purple-300",
    number: "text-purple-400",
  },
} as const;

const AKREDITASI_COLORS = {
  A: "from-green-500 to-emerald-500",
  B: "from-yellow-500 to-orange-500",
  C: "from-red-500 to-rose-500",
};

export default function Map({ data }: { data: Sekolah[] }) {
  const [expandedAddress, setExpandedAddress] = useState<number | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient)
    return (
      <div className="flex items-center justify-center h-full bg-neutral-900">
        <div className="animate-pulse text-center p-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Loading map...
          </div>
          <div className="text-sm text-neutral-400 mt-2">
            Preparing your visualization
          </div>
        </div>
      </div>
    );

  const getSchoolColor = (type: string) => {
    return SCHOOL_COLORS[type as keyof typeof SCHOOL_COLORS] || SCHOOL_COLORS.SD;
  };

  const getAkreditasiGradient = (akreditasi: string) => {
    return AKREDITASI_COLORS[akreditasi as keyof typeof AKREDITASI_COLORS] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[3.5952, 98.6722]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="z-0 [&_.leaflet-popup-content-wrapper]:bg-neutral-900/95 [&_.leaflet-popup-content-wrapper]:backdrop-blur-xl [&_.leaflet-popup-content-wrapper]:text-white [&_.leaflet-popup-content-wrapper]:shadow-2xl [&_.leaflet-popup-content-wrapper]:border [&_.leaflet-popup-content-wrapper]:border-neutral-800/50 [&_.leaflet-popup-tip]:bg-neutral-900/95"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/" class="text-blue-400 hover:text-blue-300 transition-colors">OpenStreetMap</a> contributors'
        />
        {data.map((sekolah) => {
          const schoolColor = getSchoolColor(sekolah.bentuk_pendidikan);
          
          return (
            <Marker key={sekolah.id} position={[sekolah.lat, sekolah.lng]}>
              <Popup className="rounded-xl min-w-[280px]">
                <div className="text-sm font-sans -mx-3 -my-2">
                  <div className="bg-blue-600 p-3 -mt-2 -mx-2 rounded-t-lg relative">
                    <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-medium bg-black/20 text-white rounded-bl-lg">
                      {sekolah.bentuk_pendidikan}
                    </div>
                    <h2 className="font-bold text-base text-white leading-tight pr-12">{sekolah.nama}</h2>
                    <button 
                      onClick={() => setExpandedAddress(expandedAddress === sekolah.id ? null : sekolah.id)}
                      className="text-xs text-white/70 mt-1 hover:text-white transition-colors text-left w-full cursor-pointer"
                    >
                      <p className={expandedAddress === sekolah.id ? '' : 'line-clamp-1'}>
                        {sekolah.alamat}
                      </p>
                    </button>
                  </div>
                  
                  <div className="p-3 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-neutral-400">NPSN</div>
                        <div className="font-medium">{sekolah.npsn}</div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400">Status</div>
                        <div className="font-medium">{sekolah.status}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-neutral-400">Akreditasi</div>
                      <div className={`px-3 py-1 text-xs font-medium ${
                        sekolah.akreditasi === 'A' ? 'bg-green-500' :
                        sekolah.akreditasi === 'B' ? 'bg-yellow-500' :
                        'bg-red-500'
                      } text-white rounded-full`}>
                        {sekolah.akreditasi}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 mt-2 border-t border-neutral-800/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {sekolah.jumlah_guru}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                          Guru
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {sekolah.jumlah_murid}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                          Murid
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
