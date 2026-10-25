
import React, { useEffect, useRef, useState } from 'react';

declare const L: any;

interface LocationPickerProps {
  onSelect: (location: { lat: number, lng: number, address: string }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const [address, setAddress] = useState("San Francisco, CA");

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false
      }).setView([37.7749, -122.4194], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      const marker = L.marker([37.7749, -122.4194], { draggable: true }).addTo(leafletMap.current);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        // In a real app, reverse geocoding would happen here
        setAddress(`Lat: ${pos.lat.toFixed(3)}, Lng: ${pos.lng.toFixed(3)}`);
        onSelect({ lat: pos.lat, lng: pos.lng, address: "Updated Location" });
      });
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[45] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-lg flex items-center space-x-2 w-max max-w-[90%]">
        <span className="text-red-500 text-sm">📍</span>
        <span className="text-[10px] font-bold text-slate-700 truncate">{address}</span>
      </div>
      <div className="absolute bottom-4 right-4 z-[45] bg-white p-2 rounded-xl shadow-lg border border-slate-200">
        <button 
           onClick={() => leafletMap.current?.locate({setView: true, maxZoom: 16})}
           className="w-8 h-8 flex items-center justify-center text-indigo-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default LocationPicker;
