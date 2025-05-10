"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useTheme } from "next-themes";
import { Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Set Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWVpcm1hbi1pcy1yZWF0b3IiLCJhIjoiY2x5NjVpaWNlMDVneDJ0c2F6cTVxNzZqNSJ9.WVkGzQEf4yJGjr98WSgzpA";

// Almaty coordinates
const ALMATY_COORDINATES = [76.9286, 43.2567];

interface MapProps {
  /**
   * Array of apartments to display on the map
   */
  apartments: {
    announcementId: number;
    coordsX: string;
    coordsY: string;
    title: string;
    address: string;
    cost: number;
    image?: string;
  }[];
  
  /**
   * Whether the map is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Callback function when a marker is clicked
   */
  onMarkerClick?: (apartment: any) => void;
  
  /**
   * Callback function for filtering by map selection
   */
  onPointsSelected?: (points: { x: number; y: number }[]) => void;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Show list of apartments in mobile view
   */
  showMobileList?: boolean;
}

/**
 * Enhanced Map component with theme support for Almaty
 */
export default function ApartmentsMap({
  apartments,
  isLoading = false,
  onMarkerClick,
  onPointsSelected,
  className = "",
  showMobileList = true
}: MapProps) {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<any>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<any | null>(null);
  const [mapCreated, setMapCreated] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapCreated) return;
    
    // Set initial map style based on theme
    const isDarkMode = theme === "dark";
    const initialMapStyle = isDarkMode 
      ? 'mapbox://styles/mapbox/dark-v11' 
      : 'mapbox://styles/mapbox/light-v11';
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialMapStyle,
      center: ALMATY_COORDINATES as any,
      zoom: 12
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

    // Add drawing tools if needed
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
      
      map.on('draw.create', handleDraw);
      map.on('draw.update', handleDraw);
      map.on('draw.delete', handleDraw);
    }

    map.on('load', () => {
      setMapInitialized(true);
      mapRef.current = map;
    });

    setMapCreated(true);

    return () => {
      // Clean up on unmount
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapCreated(false);
    };
  }, [theme, onPointsSelected]);

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

  // Update map style when theme changes
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;
    
    const isDarkMode = theme === "dark";
    const mapStyle = isDarkMode 
      ? 'mapbox://styles/mapbox/dark-v11' 
      : 'mapbox://styles/mapbox/light-v11';
    
    mapRef.current.setStyle(mapStyle);
  }, [theme, mapInitialized]);

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
      const lng = apartment.coordsY ? parseFloat(apartment.coordsY) : ALMATY_COORDINATES[0];
      const lat = apartment.coordsX ? parseFloat(apartment.coordsX) : ALMATY_COORDINATES[1];
      
      // Skip if coordinates are invalid
      if (isNaN(lng) || isNaN(lat)) return;
      
      // Format price for display
      const formattedPrice = apartment.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
      
      // Create a popup with theme-aware styling
      const popupContent = `
        <div class="p-2 max-w-xs">
          <div class="font-semibold text-sm mb-1">${apartment.title}</div>
          <div class="text-xs text-gray-500 mb-2">${apartment.address}</div>
          <div class="font-bold text-sm">${formattedPrice}</div>
        </div>
      `;
      
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: theme === "dark" ? "dark-theme-popup" : ""
      }).setHTML(popupContent);
      
      // Create a custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'cursor-pointer';
      markerElement.innerHTML = `
        <div class="bg-primary text-primary-foreground p-2 rounded-full flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `;
      
      // Create the marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current as mapboxgl.Map);
        
      // Add event listeners
      marker.getElement().addEventListener('mouseenter', () => {
        popup.addTo(mapRef.current!);
      });
      
      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });
      
      marker.getElement().addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(apartment);
        } else {
          setSelectedApartment(apartment);
          popup.addTo(mapRef.current!);
        }
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
  }, [apartments, mapInitialized, onMarkerClick, theme]);

  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[400px] md:min-h-[600px]"
      />
      
      {/* Mobile list of apartments */}
      {showMobileList && (
        <div className="md:hidden absolute bottom-0 left-0 right-0 max-h-[40vh] overflow-y-auto bg-background/90 backdrop-blur-sm border-t border-border rounded-t-xl shadow-lg">
          <div className="sticky top-0 bg-background/95 backdrop-blur p-3 border-b border-border z-10">
            <h3 className="font-medium text-sm">
              Найдено: {apartments.length} объявлений
            </h3>
          </div>
          
          <div className="p-3 space-y-3">
            {apartments.slice(0, 5).map((apt) => (
              <div 
                key={apt.announcementId}
                className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-accent/10 transition-colors cursor-pointer"
                onClick={() => {
                  // Find and fly to the marker
                  const lng = apt.coordsY ? parseFloat(apt.coordsY) : ALMATY_COORDINATES[0];
                  const lat = apt.coordsX ? parseFloat(apt.coordsX) : ALMATY_COORDINATES[1];
                  
                  if (mapRef.current && !isNaN(lng) && !isNaN(lat)) {
                    mapRef.current.flyTo({
                      center: [lng, lat],
                      zoom: 15,
                      essential: true
                    });
                    
                    // Trigger marker click
                    if (onMarkerClick) onMarkerClick(apt);
                    else setSelectedApartment(apt);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {apt.image ? (
                    <img 
                      src={apt.image} 
                      alt={apt.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{apt.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{apt.address}</p>
                </div>
                
                <div className="text-sm font-bold text-nowrap">{formatPrice(apt.cost)}</div>
              </div>
            ))}
            
            {apartments.length > 5 && (
              <Button 
                variant="outline" 
                className="w-full text-primary"
                onClick={() => {
                  // Navigate to full list view
                  if (onMarkerClick) {
                    // Use a null marker click to indicate showing the full list
                    onMarkerClick(null);
                  }
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Показать все ({apartments.length})
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium">Загрузка карты...</p>
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && apartments.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="bg-card p-6 rounded-lg shadow-md border text-center max-w-md">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Объявления не найдены</h3>
            <p className="text-muted-foreground mb-4">
              По данному запросу не найдено объявлений. Попробуйте изменить параметры поиска.
            </p>
            <Button variant="outline">
              Сбросить фильтры
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for mobile list
function Home(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}