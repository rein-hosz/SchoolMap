"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-pulse text-center">
        <div className="text-xl text-white">Loading map...</div>
        <div className="text-sm text-neutral-400">Please wait while we initialize the map</div>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [sekolahData, setSekolahData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const headerTimeout = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setShowHeader(true);
        if (headerTimeout.current) {
          clearTimeout(headerTimeout.current);
        }
      } else if (e.clientY > 150) {
        headerTimeout.current = setTimeout(() => {
          setShowHeader(false);
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Auto-hide header after 3 seconds
    headerTimeout.current = setTimeout(() => {
      setShowHeader(false);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (headerTimeout.current) {
        clearTimeout(headerTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    fetch("/api/sekolah")
      .then((res) => res.json())
      .then((data) => {
        setSekolahData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading sekolah:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-neutral-950">
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-neutral-900/30 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <header className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Peta Sekolah</h1>
                  <p className="text-sm text-neutral-300">
                    {isLoading ? (
                      <span className="animate-pulse">Loading data...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {sekolahData.length} sekolah tersedia
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        <Map data={sekolahData} />
      </div>
    </main>
  );
}
