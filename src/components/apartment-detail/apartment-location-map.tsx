"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Set your Mapbox access token here - in a real app, use environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoibWVpcm1hbi1pcy1yZWF0b3IiLCJhIjoiY2x5NjVpaWNlMDVneDJ0c2F6cTVxNzZqNSJ9.WVkGzQEf4yJGjr98WSgzpA';

interface ApartmentLocationMapProps {
  apartment: {
    coordsX: string;
    coordsY: string;
    title: string;
    address?: string;
    cost?: number;
  };
  zoom?: number;
}

export default function ApartmentLocationMap({ apartment, zoom = 14 }: ApartmentLocationMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return '';
    return price.toLocaleString() + ' ₸';
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const lng = Number(apartment.coordsY) || 0;
    const lat = Number(apartment.coordsX) || 0;

    // Skip if coordinates are invalid
    if (isNaN(lng) || isNaN(lat) || !lng || !lat) {
      console.error('Invalid coordinates:', { lng, lat });
      return;
    }

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation controls (zoom in/out)
    mapInstance.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    mapInstance.on('load', () => {
      // Create a custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="bg-primary text-white p-2 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;

      // Create a popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2 max-w-xs text-sm">
            <div class="font-semibold mb-1">${apartment.title}</div>
            ${apartment.address ? `<div class="text-gray-500 mb-2">${apartment.address}</div>` : ''}
            ${apartment.cost ? `<div class="font-bold">${formatPrice(apartment.cost)}</div>` : ''}
          </div>
        `);

      // Add marker to map
      marker.current = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapInstance);

      // Open popup by default
      marker.current.togglePopup();
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, [apartment, zoom]);

  // If map fails to load or coordinates are invalid
  if (!apartment.coordsX || !apartment.coordsY) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Координаты местоположения не указаны</p>
          <Button variant="outline" size="sm">
            Открыть в Google Maps
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}