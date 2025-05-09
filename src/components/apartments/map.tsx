"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useClientTranslation } from "@/i18n/client";
import { Loader2, MapPin } from "lucide-react";

// Set your Mapbox access token here (in a real app, use an environment variable)
// This is a placeholder token - replace with your own
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoibWVpcm1hbi1pcy1yZWF0b3IiLCJhIjoiY2x5NjVpaWNlMDVneDJ0c2F6cTVxNzZqNSJ9.WVkGzQEf4yJGjr98WSgzpA";

interface MapProps {
  /**
   * Array of apartments to display on the map
   */
  apartments: any[];
  
  /**
   * Whether the map is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Callback function when map points are selected (for filtering)
   */
  onPointsSelected?: (points: { x: number; y: number }[]) => void;
  
  /**
   * Callback function when a marker is clicked
   */
  onMarkerClick?: (apartment: any) => void;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Initial center point of the map [longitude, latitude]
   */
  center?: [number, number];
  
  /**
   * Initial zoom level
   */
  zoom?: number;
}

/**
 * Map component that uses Mapbox GL to display apartments as markers
 */
export default function Map({
  apartments,
  isLoading = false,
  onPointsSelected,
  onMarkerClick,
  className = "",
  center = [37.6173, 55.7558], // Moscow by default
  zoom = 11
}: MapProps) {
  const { t } = useClientTranslation("ru");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<any>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom
    });

    // Add navigation controls
    map.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );
    
    // Add geolocate control (find user's location)
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      'top-right'
    );

    // Initialize drawing tools if needed
    if (onPointsSelected) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        defaultMode: 'simple_select'
      });
      
      map.addControl(draw, 'top-left');
      drawRef.current = draw;
      
      // Set up drawing event handlers
      map.on('draw.create', handleDraw);
      map.on('draw.update', handleDraw);
      map.on('draw.delete', handleDraw);
    }

    map.on('load', () => {
      setMapInitialized(true);
      mapRef.current = map;
    });

    return () => {
      // Clean up on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, onPointsSelected]);

  // Function to handle drawing on the map
  const handleDraw = () => {
    if (!drawRef.current || !onPointsSelected || !mapRef.current) return;
    
    const data = drawRef.current.getAll();
    if (data.features.length > 0) {
      const points: { x: number; y: number }[] = [];
      
      data.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
            points.push({ x: coord[0], y: coord[1] });
          });
        }
      });
      
      onPointsSelected(points);
    } else {
      onPointsSelected([]);
    }
  };

  // Add markers when apartments change
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Clear existing popups
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];
    
    // Add markers for apartments
    apartments.forEach(apartment => {
      // Get coordinates from apartment
      const lng = apartment.coordsY ? parseFloat(apartment.coordsY) : center[0];
      const lat = apartment.coordsX ? parseFloat(apartment.coordsX) : center[1];
      
      // Skip if coordinates are invalid
      if (isNaN(lng) || isNaN(lat)) return;
      
      // Create a popup
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2 max-w-xs">
          <div class="font-semibold text-sm mb-1">${apartment.title}</div>
          <div class="text-xs text-gray-500 mb-2">${apartment.address}</div>
          <div class="font-bold text-sm">${apartment.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₸</div>
        </div>
      `);
      
      // Create a marker element
      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%231e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>')`;
      el.style.backgroundSize = 'cover';
      
      // Create the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(mapRef.current as any);
        
      // Add event listeners
      marker.getElement().addEventListener('mouseenter', () => {
        popup.setLngLat([lng, lat]).addTo(mapRef.current!);
      });
      
      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });
      
      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) onMarkerClick(apartment);
      });
      
      // Store the marker and popup
      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });
    
    // Fit map to markers if there are any
    if (markersRef.current.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      
      apartments.forEach(apartment => {
        const lng = apartment.coordsY ? parseFloat(apartment.coordsY) : null;
        const lat = apartment.coordsX ? parseFloat(apartment.coordsX) : null;
        
        if (lng && lat && !isNaN(lng) && !isNaN(lat)) {
          bounds.extend([lng, lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 14
        });
      }
    }
  }, [apartments, mapInitialized, center, onMarkerClick]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[400px]"
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">{t("map.loading", "Загрузка карты...")}</p>
          </div>
        </div>
      )}
      
      {/* Fallback notice for when Mapbox fails to load */}
      {!mapInitialized && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="bg-background/90 backdrop-blur-sm p-4 rounded-md shadow-md border z-10 text-center max-w-md">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold mb-1">
              {t("map.initialization.title", "Инициализация карты")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("map.initialization.description", "Пожалуйста, подождите, карта загружается...")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}