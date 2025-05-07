import { useEffect, useRef, useState } from "react";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import RoutingSidebar from "./map/RoutingSidebar";
import { FaRoute } from "react-icons/fa6";
import { RouteInfo } from "./map/RoutingControl";
import KelurahanStatistics from "./map/KelurahanStatistics";

interface SidebarProps {
  isOpen: boolean;
  onClose: (event: MouseEvent) => void;
  data: Sekolah[];
  isLoading: boolean;
  userLocation: L.LatLng | null;
  activeTab?: "statistics" | "routing";
  onCreateRoute: (
    origin: "user" | string | null,
    destination: string | null
  ) => void;
  onClearRoute: () => void;
  routeInfo?: RouteInfo | null;
  onSchoolTypeFilter: (type: string | null) => void;
  activeFilter: string | null;
  onTabChange: (tab: "statistics" | "routing") => void;
}

type TabType = "statistics" | "routing" | "kelurahan";

export default function Sidebar({
  isOpen,
  onClose,
  data,
  isLoading,
  userLocation,
  activeTab = "statistics",
  onCreateRoute,
  onClearRoute,
  routeInfo,
  onSchoolTypeFilter,
  activeFilter,
  onTabChange,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab);
  const [selectedKelurahanId, setSelectedKelurahanId] = useState<number | null>(
    null
  );

  // Update local tab state when prop changes
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab as TabType);
    }
  }, [activeTab]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose(event);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle tab changes and propagate to parent
  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab !== "kelurahan" && tab !== currentTab) {
      // Only call parent onTabChange for statistics and routing tabs
      onTabChange(tab);
    }
  };

  const schoolCounts = {
    SD: data.filter((s) => s.bentuk_pendidikan === "SD").length,
    SMP: data.filter((s) => s.bentuk_pendidikan === "SMP").length,
    SMA: data.filter((s) => s.bentuk_pendidikan === "SMA").length,
  };

  // Handle kelurahan selection
  const handleKelurahanSelect = (kelurahanId: number) => {
    setSelectedKelurahanId(
      kelurahanId === selectedKelurahanId ? null : kelurahanId
    );
    // You could filter schools by kelurahan here or in a parent component
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 border-l border-neutral-200 flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {currentTab === "routing" ? (
        <RoutingSidebar
          schools={data}
          userLocation={userLocation}
          onClose={() => {}} // Empty function since we no longer need close functionality
          onCreateRoute={onCreateRoute}
          onClearRoute={onClearRoute}
          routeInfo={routeInfo}
        />
      ) : (
        <>
          {/* Logo and Region */}
          <div className="p-6 pb-2 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <div className="text-lg font-bold text-neutral-800">
                Peta Sekolah
              </div>
            </div>

            {/* Region Info */}
            <div className="mt-4">
              <h2 className="text-sm font-medium text-neutral-500">Wilayah</h2>
              <p className="text-neutral-800 text-lg mt-1">
                Kecamatan Medan Denai
              </p>
            </div>
          </div>

          {/* Tab Switcher - Below "Kecamatan Medan Denai" */}
          <div className="px-6 mb-2 flex-shrink-0">
            <div className="flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => handleTabChange("statistics")}
                className={`flex-1 py-2 px-1 text-xs font-medium rounded-md transition-all ${
                  currentTab === "statistics"
                    ? "bg-white shadow text-blue-700"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                data-nav-button="true"
              >
                Statistics
              </button>

              <button
                onClick={() => handleTabChange("kelurahan")}
                className={`flex-1 py-2 px-1 text-xs font-medium rounded-md transition-all ${
                  currentTab === "kelurahan"
                    ? "bg-white shadow text-indigo-700"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
                data-nav-button="true"
              >
                Kelurahan
              </button>
            </div>
          </div>

          {/* Content based on selected tab - Use flex-1 and overflow-auto here only */}
          <div className="flex-1 overflow-auto">
            {currentTab === "kelurahan" ? (
              <KelurahanStatistics
                onSelectKelurahan={handleKelurahanSelect}
                currentKelurahanId={selectedKelurahanId}
              />
            ) : (
              <div className="p-6 pt-0 space-y-6">
                {/* School Statistics */}
                <div className="space-y-4">
                  <h2 className="text-sm font-medium text-neutral-500">
                    Statistik Sekolah
                  </h2>

                  <div className="grid gap-3">
                    {/* SD Card - Clickable */}
                    <button
                      onClick={() => onSchoolTypeFilter("SD")}
                      className={`text-left w-full ${
                        activeFilter === "SD"
                          ? "ring-2 ring-blue-400 bg-blue-50"
                          : "bg-neutral-50 hover:bg-blue-50/50"
                      } rounded-lg p-3 border border-neutral-200 transition-all duration-200`}
                      data-nav-button="true"
                    >
                      <div className="text-xs text-neutral-500">
                        Sekolah Dasar (SD)
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mt-1">
                        {schoolCounts.SD}
                      </div>
                    </button>

                    {/* SMP Card - Clickable */}
                    <button
                      onClick={() => onSchoolTypeFilter("SMP")}
                      className={`text-left w-full ${
                        activeFilter === "SMP"
                          ? "ring-2 ring-emerald-400 bg-emerald-50"
                          : "bg-neutral-50 hover:bg-emerald-50/50"
                      } rounded-lg p-3 border border-neutral-200 transition-all duration-200`}
                      data-nav-button="true"
                    >
                      <div className="text-xs text-neutral-500">
                        Sekolah Menengah Pertama (SMP)
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 mt-1">
                        {schoolCounts.SMP}
                      </div>
                    </button>

                    {/* SMA Card - Clickable */}
                    <button
                      onClick={() => onSchoolTypeFilter("SMA")}
                      className={`text-left w-full ${
                        activeFilter === "SMA"
                          ? "ring-2 ring-purple-400 bg-purple-50"
                          : "bg-neutral-50 hover:bg-purple-50/50"
                      } rounded-lg p-3 border border-neutral-200 transition-all duration-200`}
                      data-nav-button="true"
                    >
                      <div className="text-xs text-neutral-500">
                        Sekolah Menengah Atas (SMA)
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mt-1">
                        {schoolCounts.SMA}
                      </div>
                    </button>

                    {/* Total Schools Card - Clickable to reset filter */}
                    <button
                      onClick={() => onSchoolTypeFilter(null)}
                      className={`text-left w-full ${
                        activeFilter === null
                          ? "ring-2 ring-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
                      } rounded-lg p-3 border border-blue-200 transition-all duration-200`}
                      data-nav-button="true"
                    >
                      <div className="text-xs text-blue-600">Total Sekolah</div>
                      <div className="text-3xl font-bold text-blue-700 mt-1">
                        {data.length}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-sm text-neutral-500 animate-pulse">
                    Memuat data...
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
