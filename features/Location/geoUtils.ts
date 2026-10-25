
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StructuredAddress {
  countryCode: string;
  province: string;
  district: string;
  full: string;
  short: string;
}

export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371;
  const dLat = (point2.lat - point1.lat) * (Math.PI / 180);
  const dLng = (point2.lng - point1.lng) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.lat * (Math.PI / 180)) * Math.cos(point2.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km: number): string => {
  if (km < 1) return `${(km * 1000).toFixed(0)}m`;
  return `${km.toFixed(1)} km`;
};

export const reverseGeocode = async (lat: number, lng: number): Promise<StructuredAddress> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    const data = await response.json();
    const addr = data.address || {};
    const countryCode = (addr.country_code || '??').toUpperCase();
    const district = addr.city || addr.town || addr.village || 'Local Area';
    return {
      countryCode,
      province: addr.state || 'Nearby',
      district,
      full: `${countryCode}, ${district}`,
      short: `${countryCode}, ${district}`
    };
  } catch {
    return { countryCode: '??', province: '??', district: '??', full: 'Location Offline', short: 'Offline' };
  }
};
