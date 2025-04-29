"use client";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/i18n";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { MapDrawIcon, TrashIcon } from "lucide-react";

type Point = { x: number; y: number };

interface ApartmentMapProps {
  apartments: any[];
  mapPoints: Point[];
  onMapPointsSelected?: (points: Point[]) => void;
}

export default function ApartmentMap({ apartments, mapPoints, onMapPointsSelected }: ApartmentMapProps) {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const drawRef = useRef<any>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN";

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [76.9286, 43.2383], // Almaty, Kazakhstan
      zoom: 12,
    });

    const map = mapRef.current;
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    
    // Add geolocation control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      "bottom-right"
    );

    // Initialize drawing tools if mapbox-gl-draw is available
    if (typeof window !== "undefined") {
      import("@mapbox/mapbox-gl-draw").then((MapboxDraw) => {
        const draw = new MapboxDraw.default({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          },
          defaultMode: "simple_select"
        });
        
        drawRef.current = draw;
        map.addControl(draw);
        
        map.on("draw.create", handleDraw);
        map.on("draw.delete", handleDraw);
        map.on("draw.update", handleDraw);
      });
    }

    // Create markers when map loads
    map.on("load", () => {
      updateMarkers();
    });

    return () => {
      // Clean up
      markersRef.current.forEach((marker) => marker.remove());
      popupsRef.current.forEach((popup) => popup.remove());
      mapRef.current?.remove();
    };
  }, []);

  // Update markers when apartments change
  useEffect(() => {
    if (mapRef.current && mapRef.current.loaded()) {
      updateMarkers();
    }
  }, [apartments]);

  const handleDraw = () => {
    if (!drawRef.current || !onMapPointsSelected) return;
    
    const data = drawRef.current.getAll();
    
    if (data.features.length > 0) {
      const points: Point[] = [];
      
      data.features.forEach((feature: any) => {
        if (feature.geometry.type === "Polygon") {
          feature.geometry.coordinates[0].forEach((coord: number[]) => {
            points.push({ x: coord[0], y: coord[1] });
          });
        }
      });
      
      onMapPointsSelected(points);
    } else {
      onMapPointsSelected([]);
    }
  };

  const toggleDrawingMode = () => {
    if (!drawRef.current) return;
    
    const currentMode = drawRef.current.getMode();
    
    if (currentMode === "simple_select" || currentMode === "direct_select") {
      drawRef.current.changeMode("draw_polygon");
      setIsDrawingMode(true);
    } else {
      drawRef.current.changeMode("simple_select");
      setIsDrawingMode(false);
    }
  };

  const clearSelections = () => {
    if (!drawRef.current || !onMapPointsSelected) return;
    drawRef.current.deleteAll();
    onMapPointsSelected([]);
  };

  const updateMarkers = () => {
    // Clean up existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    
    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];
    
    if (!mapRef.current || !apartments || apartments.length === 0) return;
    
    const map = mapRef.current;
    
    // Filter apartments with valid coordinates
    const validApartments = apartments.filter((apt) => {
      return apt.coordsX && apt.coordsY && 
        !isNaN(parseFloat(apt.coordsX)) && 
        !isNaN(parseFloat(apt.coordsY));
    });
    
    if (validApartments.length === 0) return;
    
    // Initialize supercluster if available
    let supercluster: any = null;
    
    if (typeof window !== "undefined") {
      import("supercluster").then((Supercluster) => {
        const points = validApartments.map((apt) => ({
          type: "Feature",
          properties: {
            id: apt.announcementId,
            apartment: apt
          },
          geometry: {
            type: "Point",
            coordinates: [parseFloat(apt.coordsY), parseFloat(apt.coordsX)]
          }
        }));
        
        supercluster = new Supercluster.default({
          radius: 40,
          maxZoom: 16
        });
        
        supercluster.load(points);
        updateClusterMarkers(supercluster);
        
        map.on("zoom", () => updateClusterMarkers(supercluster));
        map.on("moveend", () => updateClusterMarkers(supercluster));
      });
    } else {
      // Fallback if supercluster is not available
      validApartments.forEach((apt) => {
        const marker = new mapboxgl.Marker({ color: "#1E40AF" })
          .setLngLat([parseFloat(apt.coordsY), parseFloat(apt.coordsX)])
          .addTo(map);
          
        marker.getElement().addEventListener("click", () => {
          createPopup(apt, [parseFloat(apt.coordsY), parseFloat(apt.coordsX)]);
        });
        
        markersRef.current.push(marker);
      });
    }
  };

  const updateClusterMarkers = (supercluster: any) => {
    if (!mapRef.current || !supercluster) return;
    
    const map = mapRef.current;
    
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    
    // Get current map bounds
    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ];
    
    const zoom = Math.floor(map.getZoom());
    const clusters = supercluster.getClusters(bbox, zoom);
    
    clusters.forEach((cluster: any) => {
      const [longitude, latitude] = cluster.geometry.coordinates;
      
      if (cluster.properties.cluster) {
        // This is a cluster
        const pointCount = cluster.properties.point_count;
        const clusterSize = pointCount < 5 ? "small" : pointCount < 10 ? "medium" : "large";
        
        const el = document.createElement("div");
        el.className = `flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-md 
                        ${clusterSize === "small" ? "w-8 h-8" : clusterSize === "medium" ? "w-10 h-10" : "w-12 h-12"}`;
        el.textContent = pointCount.toString();
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map);
          
        el.addEventListener("click", () => {
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
            16
          );
          
          map.flyTo({
            center: [longitude, latitude],
            zoom: expansionZoom + 0.5
          });
        });
        
        markersRef.current.push(marker);
      } else {
        // This is a single apartment
        const apartment = cluster.properties.apartment;
        
        const marker = new mapboxgl.Marker({ color: "#1E40AF" })
          .setLngLat([longitude, latitude])
          .addTo(map);
          
        marker.getElement().addEventListener("click", () => {
          createPopup(apartment, [longitude, latitude]);
        });
        
        markersRef.current.push(marker);
      }
    });
  };

  const createPopup = (apartment: any, coordinates: number[]) => {
    // Remove existing popups
    popupsRef.current.forEach(popup => popup.remove());
    popupsRef.current = [];
    
    if (!mapRef.current) return;
    
    const popup = new mapboxgl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false
    });
    
    popup.setLngLat(coordinates);
    
    const content = document.createElement("div");
    content.className = "w-60";
    content.innerHTML = `
      <div class="bg-white rounded-lg overflow-hidden shadow">
        <div class="relative h-32">
          <img 
            src="${apartment.image || 'https://via.placeholder.com/300x200'}" 
            alt="${apartment.title}" 
            class="w-full h-full object-cover"
            onerror="this.src='https://via.placeholder.com/300x200'"
          />
          <div class="absolute top-2 right-2 px-2 py-1 rounded text-white font-semibold bg-primary text-xs">
            ${formatPrice(apartment.cost)}
          </div>
        </div>
        <div class="p-3">
          <h3 class="font-semibold text-sm mb-1 truncate">${apartment.title}</h3>
          <p class="text-xs text-gray-500 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            ${apartment.address}
          </p>
          <a href="/apartments/${apartment.announcementId}" class="text-xs text-primary font-medium hover:underline">
            ${t('viewDetails')}
          </a>
        </div>
      </div>
    `;
    
    popup.setDOMContent(content);
    popup.addTo(mapRef.current);
    popupsRef.current.push(popup);
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      <div className="absolute top-4 left-4 space-y-2">
        <Button 
          variant={isDrawingMode ? "default" : "outline"}
          size="icon"
          onClick={toggleDrawingMode}
          title={t('drawArea')}
        >
          <MapDrawIcon className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          size="icon"
          onClick={clearSelections}
          title={t('clearSelection')}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}