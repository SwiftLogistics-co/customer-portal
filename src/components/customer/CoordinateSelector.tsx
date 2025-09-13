import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';

interface CoordinateSelectorProps {
  initialCoordinate: { lat: number; lng: number };
  onCoordinateChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
}

const CoordinateSelector: React.FC<CoordinateSelectorProps> = ({
  initialCoordinate,
  onCoordinateChange,
  onAddressChange,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCoordinate, setCurrentCoordinate] = useState(initialCoordinate);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Set Mapbox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || 'pk.eyJ1Ijoia2F2aW5kYWRpbXV0aHUiLCJhIjoiY21mNGI2bzc1MDNuazJscHhsOG5nd2Z2dyJ9.HiZ0XMlEFcfYFeqW5uHRCQ';

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCoordinate.lng, initialCoordinate.lat],
      zoom: 13,
    });

    // Add marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
      color: '#ef4444'
    })
      .setLngLat([initialCoordinate.lng, initialCoordinate.lat])
      .addTo(map.current);

    // Handle marker drag
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setCurrentCoordinate({ lat: lngLat.lat, lng: lngLat.lng });
        onCoordinateChange(lngLat.lat, lngLat.lng);
        reverseGeocode(lngLat.lat, lngLat.lng);
      }
    });

    // Handle map click
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      updateMarkerPosition(lat, lng);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const updateMarkerPosition = (lat: number, lng: number) => {
    if (marker.current && map.current) {
      marker.current.setLngLat([lng, lat]);
      setCurrentCoordinate({ lat, lng });
      onCoordinateChange(lat, lng);
      reverseGeocode(lat, lng);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const address = data.features[0].place_name;
        if (onAddressChange) {
          onAddressChange(address);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}&limit=1`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const address = data.features[0].place_name;
        
        updateMarkerPosition(lat, lng);
        
        // Fly to location
        if (map.current) {
          map.current.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true
          });
        }

        if (onAddressChange) {
          onAddressChange(address);
        }
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateMarkerPosition(latitude, longitude);
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          });
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location.');
      }
    );
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for an address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="pl-10"
          />
        </div>
        <Button 
          type="button"
          onClick={handleSearch}
          disabled={isGeocoding || !searchQuery.trim()}
          variant="outline"
        >
          {isGeocoding ? 'Searching...' : 'Search'}
        </Button>
        <Button
          type="button"
          onClick={getCurrentLocation}
          variant="outline"
          size="icon"
          title="Use current location"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainer}
          className="w-full h-64 rounded-lg border"
          style={{ minHeight: '256px' }}
        />
        
        {/* Coordinate Display */}
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm border rounded px-2 py-1 text-xs">
          Lat: {currentCoordinate.lat.toFixed(6)}, Lng: {currentCoordinate.lng.toFixed(6)}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        <MapPin className="inline h-3 w-3 mr-1" />
        Click on the map or drag the marker to select the exact delivery location
      </p>
    </div>
  );
};

export { CoordinateSelector };
