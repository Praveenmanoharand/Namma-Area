export interface GeocodedLocation {
  state: string;
  district: string;
  localBody: string;
  zone?: string;
  ward?: string;
  area: string;
  accuracy: string;
}

/**
 * Intelligent Guided Location Detection
 * Simulates reverse geocoding from GPS coordinates.
 * Future-Ready: Easy to replace internal implementation with Google Maps Geocoding,
 * OpenStreetMap Nominatim, or Tamil Nadu GIS API.
 */
export async function detectLocation(forceUnidentifiedWard = false): Promise<GeocodedLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Subtle delay to provide premium animated transition feel
        setTimeout(() => {
          if (forceUnidentifiedWard) {
            resolve({
              state: 'Tamil Nadu',
              district: 'Chennai',
              localBody: 'Greater Chennai Corporation',
              area: 'Anna Nagar West',
              accuracy: 'High Accuracy ✅'
            });
          } else {
            resolve({
              state: 'Tamil Nadu',
              district: 'Chennai',
              localBody: 'Greater Chennai Corporation',
              zone: 'Zone 10',
              ward: 'Ward 108',
              area: 'Anna Nagar West',
              accuracy: 'High Accuracy ✅'
            });
          }
        }, 1500);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
}
