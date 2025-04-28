import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import L from 'leaflet';

interface LocationContextType {
  userLocation: L.LatLng | null;
  setUserLocation: (location: L.LatLng | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<L.LatLng | null>(null);
  
  // We'll use a ref to track if we're in the browser environment
  const isBrowser = typeof window !== 'undefined';

  // Modified setUserLocation function
  const handleSetUserLocation = (location: L.LatLng | null) => {
    setUserLocation(location);
  };

  return (
    <LocationContext.Provider value={{ 
      userLocation, 
      setUserLocation: handleSetUserLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}