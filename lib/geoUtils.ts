
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StructuredAddress {
  countryCode: string;
  province: string;
  district: string;
  full: string;
  short: string; // PK, District format
}

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @returns distance in kilometers
 */
export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
  const dLng = (point2.lng - point1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * (Math.PI / 180)) *
      Math.cos(point2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km: number): string => {
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)} km`;
};

/**
 * Performs reverse geocoding to get a structured address.
 * Includes fallback logic to handle network blocks or API downtime gracefully.
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<StructuredAddress> => {
  const fallbackAddress: StructuredAddress = {
    countryCode: 'LOC',
    province: 'Nearby',
    district: 'Current Area',
    full: 'Current Location',
    short: 'Current Location'
  };

  try {
    // Adding zoom=18 and addressdetails=1 for more specific results
    // Adding an app-specific identifier as per Nominatim usage policy
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&extratags=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.address) {
      return fallbackAddress;
    }

    const addr = data.address || {};
    const countryCode = (addr.country_code || '??').toUpperCase();
    const province = addr.state || addr.province || addr.region || 'Unknown';
    const district = addr.city || addr.town || addr.district || addr.suburb || addr.village || 'Local Area';
    
    return {
      countryCode,
      province,
      district,
      full: `${countryCode}, ${province}, ${district}`,
      short: `${countryCode}, ${district}`
    };
  } catch (error) {
    // Log as warning and return fallback to prevent UI breakage
    console.warn("Geocoding service unavailable, using fallback.", error);
    return fallbackAddress;
  }
};
