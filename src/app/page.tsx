"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Sekolah } from "@/types/school";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-center">
        <div className="text-xl text-white">Loading map...</div>
        <div className="text-sm text-neutral-400">
          Please wait while we initialize the map
        </div>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [sekolahData, setSekolahData] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Add data fetching
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

  // Define schoolCounts after data is loaded
  const schoolCounts = {
    SD: sekolahData.filter(
      (s: { bentuk_pendidikan: string }) => s.bentuk_pendidikan === "SD"
    ).length,
    SMP: sekolahData.filter(
      (s: { bentuk_pendidikan: string }) => s.bentuk_pendidikan === "SMP"
    ).length,
    SMA: sekolahData.filter(
      (s: { bentuk_pendidikan: string }) => s.bentuk_pendidikan === "SMA"
    ).length,
  };

  return (
    <main className="h-screen w-screen overflow-hidden relative bg-neutral-950">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-white/20 transition-all duration-300 
          hover:bg-white hover:shadow-xl hover:scale-110 hover:rotate-90 group
          ${showSidebar ? "-translate-x-64" : "translate-x-0"}`}
        aria-label="Toggle sidebar"
      >
        <div className="space-y-1 w-4">
          <div className="h-0.5 bg-neutral-900/80 rounded-full transition-all duration-300 group-hover:bg-neutral-900"></div>
          <div className="h-0.5 bg-neutral-900/80 rounded-full transition-all duration-300 group-hover:bg-neutral-900"></div>
          <div className="h-0.5 bg-neutral-900/80 rounded-full transition-all duration-300 group-hover:bg-neutral-900"></div>
        </div>
      </button>

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        data={sekolahData}
        isLoading={isLoading}
      />

      <div className="absolute inset-0">
        <Map data={sekolahData} />
      </div>
    </main>
  );
}
