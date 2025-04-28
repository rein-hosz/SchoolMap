import L from 'leaflet';
import { LocationData } from '@/app/api/location/route';

/**
 * Save the user's current location to the API
 */
export async function saveUserLocation(location: L.LatLng): Promise<LocationData | null> {
  try {
    const response = await fetch('/api/location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: location.lat,
        lng: location.lng,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to save location:', error);
    return null;
  }
}

/**
 * Get the user's saved location from the API
 */
export async function getUserLocation(): Promise<L.LatLng | null> {
  try {
    const response = await fetch('/api/location');
    
    if (!response.ok) {
      if (response.status === 404) {
        // No location found is an expected case
        return null;
      }
      throw new Error(`Error: ${response.status}`);
    }

    const data: LocationData = await response.json();
    return L.latLng(data.lat, data.lng);
  } catch (error) {
    console.error('Failed to get location:', error);
    return null;
  }
}

/**
 * Save location to localStorage as a fallback
 */
export function saveLocationToLocalStorage(location: L.LatLng): void {
  try {
    localStorage.setItem('school_map_locations', JSON.stringify({
      userLocation: {
        lat: location.lat,
        lng: location.lng,
        timestamp: Date.now()
      }
    }));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get location from localStorage as a fallback
 */
export function getLocationFromLocalStorage(): L.LatLng | null {
  try {
    const savedData = localStorage.getItem('school_map_locations');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.userLocation) {
        return L.latLng(parsed.userLocation.lat, parsed.userLocation.lng);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
}