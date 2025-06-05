"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import TouchGesture from "@/components/TouchGesture";
import { Sekolah } from "@/types/school";
import L from "leaflet";
import Link from "next/link";
import { FaRoute, FaChartBar, FaHome } from "react-icons/fa";
import { RouteInfo } from "@/components/map/RoutingControl";

// Import LocationProvider dynamically to avoid SSR issues
const DynamicLocationProvider = dynamic(
  () =>
    import("@/contexts/LocationContext").then((mod) => mod.LocationProvider),
  { ssr: false }
);

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-neutral-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-neutral-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
        <div className="space-y-2">
          <div className="text-xl font-medium text-white">Loading map...</div>
          <div className="text-sm text-neutral-400 max-w-sm mx-auto px-4">
            Please wait while we initialize the interactive map with school
            locations
          </div>
        </div>
      </div>

      {/* Background pattern for visual interest */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [sekolahData, setSekolahData] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  const [activeTab, setActiveTab] = useState<"statistics" | "routing">(
    "statistics"
  );
  const [routeOrigin, setRouteOrigin] = useState<"user" | string | null>(null);
  const [routeDestination, setRouteDestination] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [initialPosition, setInitialPosition] = useState<
    [number, number] | null
  >(null);
  // Handle URL query parameters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      const schoolId = params.get("schoolId");
      if (schoolId) {
        setSelectedSchoolId(schoolId);
      }

      const lat = params.get("lat");
      const lng = params.get("lng");

      if (lat && lng) {
        try {
          const latValue = parseFloat(lat);
          const lngValue = parseFloat(lng);
          if (!isNaN(latValue) && !isNaN(lngValue)) {
            setInitialPosition([latValue, lngValue]);
          }
        } catch (error) {
          console.error("Invalid lat/lng parameters:", error);
        }
      }
    }
  }, []);

  // Add data fetching
  useEffect(() => {
    fetch("/api/sekolah")
      .then((res) => res.json())
      .then((data) => {
        setSekolahData(data);

        // If we have a selected school ID from URL, find and focus on that school
        if (selectedSchoolId) {
          const selectedSchool = data.find(
            (school: Sekolah) => school.uuid === selectedSchoolId
          );
          if (selectedSchool) {
            // We'll handle the focus in the Map component
          }
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading sekolah:", err);
        setIsLoading(false);
      });
  }, [selectedSchoolId]);

  // Handle map reference
  const handleMapReady = useCallback((map: L.Map) => {
    // We can remove the mapRef state since it's not being used elsewhere
  }, []);

  // Handle user location update
  const handleUserLocationUpdate = useCallback((location: L.LatLng) => {
    setUserLocation(location);
  }, []);

  // Handle route creation
  const handleCreateRoute = useCallback(
    (origin: "user" | string | null, destination: string | null) => {
      setRouteOrigin(origin);
      setRouteDestination(destination);
    },
    []
  );

  // Handle route clearing
  const handleClearRoute = useCallback(() => {
    setRouteOrigin(null);
    setRouteDestination(null);
    setRouteInfo(null);
  }, []);

  // Handle route info update
  const handleRouteInfoUpdate = useCallback((info: RouteInfo | null) => {
    setRouteInfo(info);
  }, []);

  // Handle opening the sidebar with the specified tab
  const openSidebar = (tab: "statistics" | "routing") => {
    setActiveTab(tab);
    setShowSidebar(true);
  };

  // Handle tab change without closing the sidebar
  const handleTabChange = useCallback((tab: "statistics" | "routing") => {
    setActiveTab(tab);
  }, []);

  // Close sidebar only when clicking outside the sidebar and navigation buttons
  const handleSidebarClose = useCallback((event: MouseEvent) => {
    // Check if the click was on the statistics or routing buttons
    const target = event.target as HTMLElement;
    const isNavButton = target.closest('[data-nav-button="true"]');

    // Only close if not clicking on the navigation buttons
    if (!isNavButton) {
      setShowSidebar(false);
    }
  }, []);

  return (
    <DynamicLocationProvider>
      {" "}
      <main className="h-screen w-screen overflow-hidden relative bg-neutral-950">
        {/* Responsive floating navigation */}{" "}
        <div
          className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            showSidebar
              ? "sm:-translate-x-72 lg:-translate-x-80 -translate-x-4"
              : "translate-x-0"
          }`}
        >
          {/* Mobile: Horizontal layout on small screens, Vertical on larger screens */}
          <div className="flex sm:flex-col flex-row gap-2 sm:gap-3">
            <button
              onClick={() => openSidebar("statistics")}
              data-nav-button="true"
              className={`bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl shadow-lg border transition-all duration-300 
                hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11
                active:scale-95 touch-manipulation
                ${
                  activeTab === "statistics" && showSidebar
                    ? "border-blue-500 ring-2 ring-blue-300/50 bg-blue-50"
                    : "border-neutral-200/60"
                }`}
              aria-label="School Statistics"
            >
              <FaChartBar
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  activeTab === "statistics" && showSidebar
                    ? "text-blue-600"
                    : "text-neutral-700"
                }`}
              />
            </button>
            <button
              onClick={() => openSidebar("routing")}
              data-nav-button="true"
              className={`bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl shadow-lg border transition-all duration-300 
                hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11
                active:scale-95 touch-manipulation
                ${
                  activeTab === "routing" && showSidebar
                    ? "border-emerald-500 ring-2 ring-emerald-300/50 bg-emerald-50"
                    : "border-neutral-200/60"
                }`}
              aria-label="Routing"
            >
              <FaRoute
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  activeTab === "routing" && showSidebar
                    ? "text-emerald-600"
                    : "text-neutral-700"
                }`}
              />
            </button>{" "}
            <Link href="/">
              <button
                data-nav-button="true"
                className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl shadow-lg border transition-all duration-300 
                  hover:bg-white hover:shadow-xl flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11
                  border-neutral-200/60 active:scale-95 touch-manipulation"
                aria-label="Home"
              >
                <FaHome className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
              </button>
            </Link>
          </div>
        </div>{" "}
        <Sidebar
          isOpen={showSidebar}
          onClose={handleSidebarClose}
          data={sekolahData}
          isLoading={isLoading}
          userLocation={userLocation}
          onCreateRoute={handleCreateRoute}
          onClearRoute={handleClearRoute}
          activeTab={activeTab}
          routeInfo={routeInfo}
          onSchoolTypeFilter={setSchoolTypeFilter}
          activeFilter={schoolTypeFilter}
          onTabChange={handleTabChange}
        />
        {/* Touch gesture wrapper for mobile navigation */}
        <TouchGesture
          onSwipeLeft={() => setShowSidebar(true)}
          onSwipeRight={() => setShowSidebar(false)}
          threshold={100}
          className="absolute inset-0"
        >
          <Map
            data={sekolahData}
            onMapReady={handleMapReady}
            onUserLocationUpdate={handleUserLocationUpdate}
            routeOrigin={routeOrigin}
            routeDestination={routeDestination}
            onRouteInfoUpdate={handleRouteInfoUpdate}
            schoolTypeFilter={schoolTypeFilter}
            initialPosition={initialPosition}
            selectedSchoolId={selectedSchoolId}
          />
        </TouchGesture>
      </main>
    </DynamicLocationProvider>
  );
}
