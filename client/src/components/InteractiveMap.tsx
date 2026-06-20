import { useEffect, useRef, useCallback, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation } from "lucide-react";

interface MapPin {
  id: number;
  name: string;
  emoji: string;
  category: string;
  price: string;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  pins: MapPin[];
  center: [number, number];
  zoom?: number;
  selectedPinId: number | null;
  onPinSelect: (id: number) => void;
  filteredCategory: string | null;
  userLocation?: [number, number] | null;
  showRecenterButton?: boolean;
}

export function InteractiveMap({ pins, center, zoom = 13, selectedPinId, onPinSelect, filteredCategory, userLocation, showRecenterButton = true }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const markerMetaRef = useRef<Map<number, { visualKey: string; lat: number; lng: number }>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const onPinSelectRef = useRef(onPinSelect);
  onPinSelectRef.current = onPinSelect;

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 11,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
      markersRef.current.clear();
      markerMetaRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    map.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !selectedPinId) return;
    const pin = pins.find(p => p.id === selectedPinId);
    if (pin) {
      map.panTo([pin.lat, pin.lng], { animate: true });
    }
  }, [selectedPinId, pins]);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 100);
  }, []);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userLocation) {
      const icon = L.divIcon({
        html: `<div class="user-location-dot"><div class="user-location-pulse"></div><div class="user-location-center"></div></div>`,
        className: "user-location-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      userMarkerRef.current = L.marker(userLocation, { icon, interactive: false, zIndexOffset: 1000 }).addTo(map);
    }
  }, [userLocation]);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;

    const buildIcon = (pin: MapPin, isSelected: boolean, isFiltered: boolean, isBarsPin: boolean) => {
      const html = `
        <div class="pin-marker ${isSelected ? 'pin-selected' : ''} ${!isFiltered ? 'pin-dimmed' : ''} ${isBarsPin ? 'pin-drunk-sway' : ''}" data-testid="map-pin-${pin.id}">
          <div class="pin-content">
            <span class="pin-emoji">${pin.emoji}</span>
            <span class="pin-price">${pin.price}</span>
          </div>
          ${isSelected ? '<div class="pin-arrow"></div>' : ''}
        </div>
      `;
      return L.divIcon({ html, className: "custom-pin-icon", iconSize: [70, 30], iconAnchor: [35, 15] });
    };

    // Remove markers for pins that no longer exist
    const desiredIds = new Set(pins.map(p => p.id));
    markersRef.current.forEach((marker, id) => {
      if (!desiredIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
        markerMetaRef.current.delete(id);
      }
    });

    // Add new markers; update existing ones only when something actually changed
    pins.forEach((pin) => {
      const isFiltered = !filteredCategory || pin.category === filteredCategory;
      const isSelected = selectedPinId === pin.id;
      const isBarsPin = pin.category === "Bars" && filteredCategory === "Bars" && isFiltered && !isSelected;
      const visualKey = `${pin.emoji}|${pin.price}|${isSelected ? 1 : 0}|${isFiltered ? 1 : 0}|${isBarsPin ? 1 : 0}`;

      const existing = markersRef.current.get(pin.id);
      const meta = markerMetaRef.current.get(pin.id);

      if (existing && meta) {
        if (meta.lat !== pin.lat || meta.lng !== pin.lng) {
          existing.setLatLng([pin.lat, pin.lng]);
        }
        if (meta.visualKey !== visualKey) {
          existing.setIcon(buildIcon(pin, isSelected, isFiltered, isBarsPin));
        }
        markerMetaRef.current.set(pin.id, { visualKey, lat: pin.lat, lng: pin.lng });
        return;
      }

      const marker = L.marker([pin.lat, pin.lng], { icon: buildIcon(pin, isSelected, isFiltered, isBarsPin) }).addTo(map);
      marker.on("click", () => onPinSelectRef.current(pin.id));
      markersRef.current.set(pin.id, marker);
      markerMetaRef.current.set(pin.id, { visualKey, lat: pin.lat, lng: pin.lng });
    });
  }, [pins, selectedPinId, filteredCategory]);

  const [recentering, setRecentering] = useState(false);
  const [recenterError, setRecenterError] = useState<string | null>(null);
  const lastRecenterTime = useRef(0);
  const lastGeoFetchAt = useRef(0);
  const cachedGeoPosition = useRef<[number, number] | null>(null);

  const handleRecenter = useCallback(() => {
    const now = Date.now();
    if (now - lastRecenterTime.current < 2000) return;
    lastRecenterTime.current = now;

    setRecenterError(null);

    if (cachedGeoPosition.current && now - lastGeoFetchAt.current < 30000) {
      const map = leafletMap.current;
      if (map) map.flyTo(cachedGeoPosition.current, 15, { duration: 0.8 });
      return;
    }

    if (!navigator.geolocation) {
      if (leafletMap.current && userLocation) {
        leafletMap.current.flyTo(userLocation, 15, { duration: 0.8 });
      } else {
        setRecenterError("Location not available");
        setTimeout(() => setRecenterError(null), 3000);
      }
      return;
    }
    setRecentering(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        cachedGeoPosition.current = coords;
        lastGeoFetchAt.current = Date.now();
        const map = leafletMap.current;
        if (map) map.flyTo(coords, 15, { duration: 0.8 });
        setRecentering(false);
      },
      (err) => {
        const map = leafletMap.current;
        if (map) {
          if (userLocation) {
            map.flyTo(userLocation, 15, { duration: 0.8 });
          } else {
            map.flyTo(center, zoom, { duration: 0.8 });
          }
        }
        if (err.code === 1) {
          setRecenterError("Location permission denied");
        } else {
          setRecenterError("Could not get location");
        }
        setTimeout(() => setRecenterError(null), 3000);
        setRecentering(false);
      },
      { timeout: 5000, maximumAge: 30000 }
    );
  }, [userLocation, center, zoom]);

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />
      {showRecenterButton && (
        <div className="absolute bottom-4 right-4 z-[10] flex flex-col items-end gap-1">
          {recenterError && (
            <div className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[11px] font-medium whitespace-nowrap" data-testid="text-recenter-error">
              {recenterError}
            </div>
          )}
          <button
            onClick={handleRecenter}
            disabled={recentering}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200/80 active:scale-95 transition-transform"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
            data-testid="button-recenter-map"
            aria-label="Center on my location"
          >
            <Navigation className={`w-4.5 h-4.5 text-[#4285F4] ${recentering ? "animate-pulse" : ""}`} />
          </button>
        </div>
      )}
      <style>{`
        .custom-pin-icon {
          background: none !important;
          border: none !important;
          overflow: visible !important;
        }
        .pin-marker {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pin-content {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 4px 8px;
          border-radius: 20px;
          background: white;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Figtree', sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          white-space: nowrap;
          line-height: 1.2;
          overflow: hidden;
        }
        .pin-emoji {
          font-size: 12px;
          line-height: 1;
          flex-shrink: 0;
        }
        .pin-price {
          font-size: 11px;
          line-height: 1;
          flex-shrink: 0;
        }
        .pin-selected .pin-content {
          background: hsl(222, 47%, 11%);
          color: white;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .pin-selected {
          transform: translate(-50%, -50%) scale(1.1);
          z-index: 100 !important;
        }
        .pin-dimmed .pin-content {
          background: rgba(255,255,255,0.6);
          color: rgba(0,0,0,0.4);
        }
        .pin-arrow {
          position: absolute;
          left: 50%;
          bottom: -6px;
          transform: translateX(-50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background: hsl(222, 47%, 11%);
        }
        .leaflet-container {
          background: #E8E5E0 !important;
          z-index: 0 !important;
          isolation: isolate;
        }
        .leaflet-tile {
          filter: saturate(0.3) contrast(0.95) brightness(1.06);
        }
        .pin-drunk-sway {
          animation: pin-sway 8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
          transform-origin: bottom center;
        }
        .pin-drunk-sway:nth-child(odd) {
          animation-delay: -3s;
        }
        @keyframes pin-sway {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          14% { transform: translate(-50%, -50%) rotate(-2.5deg) translateX(-2px); }
          32% { transform: translate(-50%, -50%) rotate(3deg) translateX(2.5px); }
          50% { transform: translate(-50%, -50%) rotate(-1.5deg) translateX(-1px); }
          68% { transform: translate(-50%, -50%) rotate(2deg) translateX(1.5px); }
          85% { transform: translate(-50%, -50%) rotate(-1deg) translateX(-0.5px); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .user-location-icon {
          background: none !important;
          border: none !important;
        }
        .user-location-dot {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .user-location-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #4285F4;
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          z-index: 2;
        }
        .user-location-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(66, 133, 244, 0.25);
          animation: user-pulse 2s ease-out infinite;
          z-index: 1;
        }
        @keyframes user-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}
