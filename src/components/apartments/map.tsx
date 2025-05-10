"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import { Loader2, MapPin, Search, Building, Home, X, ChevronRight, ChevronLeft, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import Supercluster from 'supercluster';

// Set Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoibWVpcm1hbi1pcy1yZWF0b3IiLCJhIjoiY2x5NjVpaWNlMDVneDJ0c2F6cTVxNzZqNSJ9.WVkGzQEf4yJGjr98WSgzpA";

// Almaty coordinates - default center
const ALMATY_COORDINATES = [76.9286, 43.2567];

// Custom styles for the map - simplified to just streets and dark
const MAP_STYLES = {
  streets: "mapbox://styles/mapbox/streets-v12",
  dark: "mapbox://styles/mapbox/dark-v11"
};

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
    roomCount?: string;
    selectedGender?: string;
    roommates?: number;
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
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Show list of apartments in mobile view
   */
  showMobileList?: boolean;
  
  /**
   * Initial zoom level
   */
  initialZoom?: number;
}

/**
 * Improved Mapbox Map component with cluster support, fixed hover behavior,
 * and apartment list selection
 */
export default function ApartmentsMap({
  apartments,
  isLoading = false,
  onMarkerClick,
  className = "",
  showMobileList = true,
  initialZoom = 12
}: MapProps) {
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const clusterRef = useRef<Supercluster | null>(null);
  
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<any | null>(null);
  const [mapCreated, setMapCreated] = useState(false);
  const [visibleListings, setVisibleListings] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const itemsPerPage = isMobile ? 2 : 3;
  const [clusterData, setClusterData] = useState<any[]>([]);
  
  // Initialize map when component mounts or when theme changes
  useEffect(() => {
    // Clean up any existing map before creating a new one
    if (mapRef.current) {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      Object.values(popupsRef.current).forEach(popup => popup.remove());
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = {};
      popupsRef.current = {};
    }
    
    if (!mapContainerRef.current) return;
    
    // Set map style based on theme
    const isDarkMode = theme === "dark";
    const initialStyle = isDarkMode ? MAP_STYLES.dark : MAP_STYLES.streets;
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: ALMATY_COORDINATES as [number, number],
      zoom: initialZoom,
      pitch: 0, // No 3D effect
      bearing: 0, // No rotation
      antialias: true
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

    // Initialize map
    map.on('load', () => {
      // Initialize visible listings
      if (apartments.length > 0) {
        setVisibleListings(apartments.slice(0, itemsPerPage));
      }
      
      setMapInitialized(true);
      mapRef.current = map;
      
      // Initialize the supercluster
      initializeCluster();
      
      // Force fit to bounds of Almaty
      const almatyBounds = new mapboxgl.LngLatBounds(
        [76.7286, 43.0567], // Southwest
        [77.1286, 43.4567]  // Northeast
      );
      
      map.fitBounds(almatyBounds, {
        padding: 50,
        maxZoom: initialZoom
      });
    });
    
    // Update clusters when the map moves
    map.on('moveend', () => {
      if (mapRef.current && clusterRef.current) {
        updateClusters();
      }
    });

    setMapCreated(true);

    return () => {
      // Clean up on unmount
      Object.values(markersRef.current).forEach(marker => marker.remove());
      Object.values(popupsRef.current).forEach(popup => popup.remove());
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapCreated(false);
      markersRef.current = {};
      popupsRef.current = {};
    };
  }, [initialZoom, theme]);

  // Update map style when theme changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const isDarkMode = theme === "dark";
    const newMapStyle = isDarkMode ? MAP_STYLES.dark : MAP_STYLES.streets;
    
    // Only update style if map is initialized
    if (mapInitialized) {
      mapRef.current.setStyle(newMapStyle);
    }
    // If map is created but theme changes, force reinitialize the map
    else if (mapCreated) {
      setMapCreated(false);
    }
  }, [mapInitialized, theme, mapCreated]);

  // Initialize the clustering
  const initializeCluster = () => {
    // Create a new supercluster instance
    clusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });
    
    // Convert apartments to GeoJSON features
    const points = apartments.map(apartment => {
      const lng = apartment.coordsY ? parseFloat(apartment.coordsY) : null;
      const lat = apartment.coordsX ? parseFloat(apartment.coordsX) : null;
      
      if (!lng || !lat || isNaN(lng) || isNaN(lat)) return null;
      
      return {
        type: 'Feature',
        properties: {
          id: apartment.announcementId.toString(),
          apartment: apartment
        },
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        }
      };
    }).filter(Boolean);
    
    // Load the points into the cluster
    if (clusterRef.current && points.length > 0) {
      clusterRef.current.load(points as any);
      updateClusters();
    }
  };
  
  // Update clusters based on current map bounds and zoom
  const updateClusters = () => {
    if (!mapRef.current || !clusterRef.current) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Get the current bounds and zoom
    const bounds = mapRef.current.getBounds();
    const zoom = Math.floor(mapRef.current.getZoom());
    
    // Get clusters for the current view
    if (bounds) {
      const clusters = clusterRef.current.getClusters(
        [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth()
        ],
        zoom
      );
      
      setClusterData(clusters);
      
      // Create markers for clusters and points
      clusters.forEach(cluster => {
        if (cluster.properties.cluster) {
          // This is a cluster
          createClusterMarker(cluster);
        } else {
          // This is a single point
          createSingleMarker(cluster);
        }
      });
    }
  };
  
  // Create a marker for a cluster
  const createClusterMarker = (cluster: any) => {
    if (!mapRef.current) return;
    
    const coordinates = cluster.geometry.coordinates;
    const pointCount = cluster.properties.point_count;
    const clusterId = cluster.properties.cluster_id;
    
    // Create a cluster marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'cursor-pointer transition-all duration-300';
    markerElement.innerHTML = `
      <div class="bg-primary text-primary-foreground px-3 py-2 rounded-full flex items-center justify-center shadow-lg">
        <span class="font-semibold">${pointCount}</span>
      </div>
    `;
    
    // Create the marker
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'center'
    })
      .setLngLat(coordinates)
      .addTo(mapRef.current);
    
    // Store the marker
    markersRef.current[`cluster-${clusterId}`] = marker;
    
    // Handle click - zoom to cluster
    markerElement.addEventListener('click', () => {
      if (!mapRef.current || !clusterRef.current) return;
      
      // Get the cluster expansion zoom
      const expansionZoom = Math.min(
        (clusterRef.current as any).getClusterExpansionZoom(clusterId),
        20
      );
      
      // Zoom to the cluster
      mapRef.current.flyTo({
        center: coordinates,
        zoom: expansionZoom,
        essential: true,
        duration: 500
      });
    });
  };
  
  // Create a marker for a single apartment
  const createSingleMarker = (point: any) => {
    if (!mapRef.current) return;
    
    const coordinates = point.geometry.coordinates;
    const apartment = point.properties.apartment;
    const id = point.properties.id;
    
    // Format price for display
    const formattedPrice = apartment.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
    
    // Create a popup with theme-aware styling
    const popupContent = `
      <div class="p-3 max-w-xs shadow-lg rounded-lg">
        <div class="font-semibold text-sm mb-1">${apartment.title}</div>
        <div class="text-xs text-gray-500 mb-2">${apartment.address}</div>
        <div class="font-bold text-sm text-primary">${formattedPrice}</div>
      </div>
    `;
    
    const popup = new mapboxgl.Popup({ 
      offset: 25,
      closeButton: false,
      className: theme === "dark" ? "dark-theme-popup" : "",
      maxWidth: "300px",
      closeOnClick: false
    }).setHTML(popupContent);
    
    // Create a custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'cursor-pointer';
    markerElement.innerHTML = `
      <div class="marker-container">
        <div class="bg-primary text-primary-foreground p-2 rounded-full flex items-center justify-center shadow-lg relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div class="absolute -top-2 -right-2 bg-card text-foreground w-6 h-6 flex items-center justify-center rounded-full text-xs border-2 border-background font-medium shadow-md">
            ${apartment.roommates || 1}
          </div>
        </div>
      </div>
    `;
    
    // Create the marker
    const marker = new mapboxgl.Marker({
      element: markerElement,
      anchor: 'bottom'
    })
      .setLngLat(coordinates)
      .addTo(mapRef.current);
    
    // Store the marker and popup
    markersRef.current[id] = marker;
    popupsRef.current[id] = popup;
    
    // Handle click - select the apartment
    markerElement.addEventListener('click', () => {
      // Close all popups
      Object.values(popupsRef.current).forEach(p => p.remove());
      
      // Set this apartment as selected and show its popup in the list
      setSelectedApartment(apartment);
      
      // Show the popup for this marker
      popup.addTo(mapRef.current!);
      
      // Update the visibleListings to include this apartment at the top
      setVisibleListings(prev => {
        const filtered = prev.filter(a => a.announcementId !== apartment.announcementId);
        return [apartment, ...filtered.slice(0, itemsPerPage - 1)];
      });
      
      // Make sure the mobile list is visible if on mobile
      if (isMobile) {
        setIsMobileListVisible(true);
      }
      
      // Don't directly navigate with onMarkerClick - we'll handle that in the list
    });
    
    // Handle hover to show/hide popup
    const showPopup = () => {
      if (mapRef.current) {
        popup.addTo(mapRef.current);
      }
    };
    
    const hidePopup = () => {
      if (selectedApartment?.announcementId !== apartment.announcementId) {
        popup.remove();
      }
    };
    
    markerElement.addEventListener('mouseenter', showPopup);
    markerElement.addEventListener('mouseleave', hidePopup);
  };

  // Add markers when apartments change
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;
    
    // Initialize clustering
    initializeCluster();
    
    // Initialize visible listings
    if (apartments.length > 0) {
      setVisibleListings(apartments.slice(0, itemsPerPage));
    }
  }, [apartments, itemsPerPage, mapInitialized]);

  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
  };
  
  // Handle pagination for the listing panel
  const handleNextPage = () => {
    const startIndex = currentPage * itemsPerPage;
    if (startIndex < apartments.length) {
      setVisibleListings(apartments.slice(startIndex, startIndex + itemsPerPage));
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const startIndex = (currentPage - 2) * itemsPerPage;
      setVisibleListings(apartments.slice(startIndex, startIndex + itemsPerPage));
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Get gender label
  const getGenderLabel = (gender: string = "ANY"): string => {
    const genderMap: Record<string, string> = {
      "MALE": "Мужской",
      "FEMALE": "Женский",
      "ANY": "Любой пол",
      "OTHER": "Любой пол"
    };
    return genderMap[gender] || "Любой пол";
  };
  
  // Fly to apartment location and update selected apartment
  const handleApartmentSelect = (apartment: any) => {
    if (!mapRef.current) return;
    
    const lng = apartment.coordsY ? parseFloat(apartment.coordsY) : ALMATY_COORDINATES[0];
    const lat = apartment.coordsX ? parseFloat(apartment.coordsX) : ALMATY_COORDINATES[1];
    
    if (isNaN(lng) || isNaN(lat)) return;
    
    // Set as selected apartment
    setSelectedApartment(apartment);
    
    // Close all popups
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    
    // Show popup for this apartment's marker
    const id = apartment.announcementId.toString();
    if (popupsRef.current[id] && markersRef.current[id]) {
      popupsRef.current[id].addTo(mapRef.current);
    }
    
    // Fly to the location
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 15,
      essential: true,
      duration: 1000
    });
  };
  
  // Navigate to the apartment details page
  const navigateToApartmentDetails = (apartment: any) => {
    if (onMarkerClick) {
      onMarkerClick(apartment);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full min-h-[400px] md:min-h-[600px]"
      />
      
      {/* Listings panel (desktop) */}
      {!isMobile && apartments.length > 0 && (
        <div className="absolute top-4 right-14 w-80 max-h-[80vh] overflow-y-auto bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg">
          <div className="sticky top-0 bg-background/95 backdrop-blur p-3 border-b border-border z-10 flex justify-between items-center">
            <h3 className="font-medium text-sm">
              Найдено: {apartments.length} объявлений
            </h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs flex items-center">
                {currentPage} из {Math.ceil(apartments.length / itemsPerPage)}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleNextPage}
                disabled={currentPage * itemsPerPage >= apartments.length}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-3 space-y-3">
            {visibleListings.map((apt) => (
              <div 
                key={apt.announcementId}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border hover:bg-accent/10 transition-colors cursor-pointer",
                  selectedApartment?.announcementId === apt.announcementId 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
                onClick={() => handleApartmentSelect(apt)}
              >
                <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                  {apt.image ? (
                    <img 
                      src={apt.image} 
                      alt={apt.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1">{apt.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{apt.address}</p>
                  <div className="flex items-center gap-1 mt-1 justify-between">
                    <span className="text-xs bg-accent/40 px-1.5 py-0.5 rounded-full">
                      {apt.roomCount || 1} комн.
                    </span>
                    {apt.selectedGender && (
                      <span className="text-xs bg-accent/40 px-1.5 py-0.5 rounded-full">
                        {getGenderLabel(apt.selectedGender)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm font-bold text-nowrap">{formatPrice(apt.cost)}</div>
              </div>
            ))}
            
            {selectedApartment && (
              <Button 
                variant="default" 
                size="sm"
                className="w-full mt-2" 
                onClick={() => navigateToApartmentDetails(selectedApartment)}
              >
                Посмотреть детали
              </Button>
            )}
            
            {apartments.length > itemsPerPage && (
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs" 
                  onClick={() => {
                    // Navigate to full list view
                    if (onMarkerClick) {
                      // Use a null marker click to indicate showing the full list
                      onMarkerClick(null);
                    }
                  }}
                >
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  Посмотреть все на списке
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Mobile list of apartments */}
      {isMobile && showMobileList && apartments.length > 0 && isMobileListVisible && (
        <div className="absolute bottom-0 left-0 right-0 max-h-[40vh] overflow-y-auto bg-background/90 backdrop-blur-sm border-t border-border rounded-t-xl shadow-lg">
          <div className="sticky top-0 bg-background/95 backdrop-blur p-3 border-b border-border z-10 flex justify-between items-center">
            <h3 className="font-medium text-sm">
              Найдено: {apartments.length} объявлений
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Close list"
              onClick={() => setIsMobileListVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 space-y-3">
            {visibleListings.map((apt) => (
              <div 
                key={apt.announcementId}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border hover:bg-accent/10 transition-colors cursor-pointer",
                  selectedApartment?.announcementId === apt.announcementId 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                )}
                onClick={() => handleApartmentSelect(apt)}
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
                      <Home className="h-5 w-5 text-primary" />
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
            
            {selectedApartment && (
              <Button 
                variant="default" 
                size="sm"
                className="w-full mt-2" 
                onClick={() => navigateToApartmentDetails(selectedApartment)}
              >
                Посмотреть детали
              </Button>
            )}
            
            <div className="flex justify-between mt-2">
              <Button
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1.5" />
                Назад
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs" 
                onClick={handleNextPage}
                disabled={currentPage * itemsPerPage >= apartments.length}
              >
                Вперед
                <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Show bottom button to bring back the mobile list if hidden */}
      {isMobile && showMobileList && apartments.length > 0 && !isMobileListVisible && (
        <Button
          className="absolute bottom-4 right-4 shadow-lg"
          onClick={() => setIsMobileListVisible(true)}
        >
          <List className="h-4 w-4 mr-2" />
          Показать список
        </Button>
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
          </div>
        </div>
      )}
      
      {/* Custom CSS for the map */}
      <style jsx global>{`
        .mapboxgl-popup {
          max-width: 300px !important;
        }
        
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          overflow: hidden !important;
        }
        
        .dark .mapboxgl-popup-content {
          background: #1f2937 !important;
          color: #f9fafb !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        .dark .mapboxgl-popup-tip {
          border-top-color: #1f2937 !important;
          border-bottom-color: #1f2937 !important;
        }
        
        .mapboxgl-ctrl-group {
          border-radius: 8px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
        }
        
        .dark .mapboxgl-ctrl-group {
          background: #1f2937 !important;
        }
        
        .dark .mapboxgl-ctrl-group button {
          background-color: #1f2937 !important;
          color: #f9fafb !important;
        }
        
        .dark .mapboxgl-ctrl-group button svg {
          fill: #f9fafb !important;
        }
        
        /* Custom marker styling */
        .marker-container {
          transition: transform 0.2s ease-out;
          transform-origin: bottom center;
        }
        
        .marker-container:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}