import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useQuery } from '@tanstack/react-query';
import { usePolling } from '@/hooks/usePolling';

interface MapComponentProps {
  orderId: string;
  driverId?: string;
  route?: {
    polyline: string;
    coordinates: [number, number][];
  };
  onDriverLocationUpdate?: (location: { lat: number; lng: number; timestamp: string }) => void;
}

interface DriverLocation {
  lat: number;
  lon: number;
  timestamp: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  orderId, 
  driverId, 
  route,
  onDriverLocationUpdate 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Set Mapbox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || 'pk.eyJ1Ijoia2F2aW5kYWRpbXV0aHUiLCJhIjoiY21mNGI2bzc1MDNuazJscHhsOG5nd2Z2dyJ9.HiZ0XMlEFcfYFeqW5uHRCQ';

  // Fetch driver location with polling
  const { data: driverLocation } = useQuery<DriverLocation>({
    queryKey: ['driver-location', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3001'}/drivers/${driverId}/location`);
      if (!response.ok) throw new Error('Failed to fetch driver location');
      return response.json();
    },
    enabled: !!driverId && isMapLoaded,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Enable polling for driver location
  usePolling({
    queryKey: ['driver-location', driverId],
    pollingInterval: 5000,
    enabled: !!driverId && isMapLoaded
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.5, 40], // Default center (NYC area)
      zoom: 9,
    });

    map.current.on('load', () => {
      setIsMapLoaded(true);
      
      // Add route if available
      if (route && route.coordinates) {
        // Add route line
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates
            }
          }
        });

        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Fit map to show route
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach(coord => bounds.extend(coord as [number, number]));
        map.current?.fitBounds(bounds, { padding: 50 });
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [route]);

  // Update driver marker when location changes
  useEffect(() => {
    if (!map.current || !driverLocation || !isMapLoaded) return;

    const { lat, lon, timestamp } = driverLocation;

    if (driverMarker.current) {
      // Update existing marker position
      driverMarker.current.setLngLat([lon, lat]);
    } else {
      // Create new marker
      const el = document.createElement('div');
      el.className = 'driver-marker';
      el.style.cssText = `
        background-color: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      driverMarker.current = new mapboxgl.Marker(el)
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div class="p-2">
            <h4 class="font-medium">Driver Location</h4>
            <p class="text-sm text-gray-600">Updated: ${new Date(timestamp).toLocaleTimeString()}</p>
          </div>
        `))
        .addTo(map.current);
    }

    // Notify parent component of location update
    if (onDriverLocationUpdate) {
      onDriverLocationUpdate({ lat, lng: lon, timestamp });
    }

    // Center map on driver if no route is shown
    if (!route) {
      map.current.setCenter([lon, lat]);
    }
  }, [driverLocation, isMapLoaded, onDriverLocationUpdate, route]);

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      {driverLocation && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="text-sm">
              <p className="font-medium">Live Tracking</p>
              <p className="text-gray-600 text-xs">
                Updated {new Date(driverLocation.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;