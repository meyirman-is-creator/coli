"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import Supercluster from "supercluster";
import { Apartment } from "@/types/apartment";
import { Loader2 } from "lucide-react";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "your-mapbox-token";

interface MapProps {
  apartments: Apartment[];
  selectedApartment?: Apartment | null;
  isLoading?: boolean;
  onPointsSelected?: (points: { x: number; y: number }[]) => void;
  onMarkerClick?: (apartment: Apartment) => void;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  apartments,
  selectedApartment,
  isLoading = false,
  onPointsSelected,
  onMarkerClick,
  className = "",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const drawRef = useRef<any>(null);
  const superclusterRef = useRef<Supercluster | null>(null);

  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [37.6173, 55.7558], // Moscow by default
      zoom: 10,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add geolocation control
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      "top-right"
    );

    // Initialize draw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "simple_select",
    });

    map.addControl(draw);
    drawRef.current = draw;

    // Setup drawing event handlers
    map.on("draw.create", handleDraw);
    map.on("draw.update", handleDraw);
    map.on("draw.delete", handleDraw);

    // Set map reference
    mapRef.current = map;

    // Set up the map after it's loaded
    map.on("load", () => {
      setMapReady(true);
    });

    // Clean up when component unmounts
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Function to handle drawing on the map
  function handleDraw() {
    if (!drawRef.current || !onPointsSelected) return;

    const data = drawRef.current.getAll();
    if (data.features.length > 0) {
      const points: { x: number; y: number }[] = [];

      data.features.forEach((feature: any) => {
        if (feature.geometry.type === "Polygon") {
          feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
            points.push({ x: coord[0], y: coord[1] });
          });
        }
      });

      if (onPointsSelected) {
        onPointsSelected(points);
      }
    } else if (onPointsSelected) {
      onPointsSelected([]);
    }
  }

  // Update markers when apartments change
  useEffect(() => {
    if (mapReady && mapRef.current) {
      updateMarkers();
    }
  }, [apartments, mapReady, selectedApartment]);

  // Function to update markers on the map
  const updateMarkers = () => {
    // Clear existing markers and popups
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    popupsRef.current.forEach((popup) => popup.remove());
    popupsRef.current = [];

    if (!mapRef.current || apartments.length === 0) return;

    const map = mapRef.current;

    // Create GeoJSON features for clustering
    const points = apartments.map((apt) => {
      // Use location coordinates if available, otherwise use default
      const lng =
        apt.location.longitude ||
        parseFloat(apt.location.cityName === "Москва" ? "37.6173" : "76.9286");
      const lat =
        apt.location.latitude ||
        parseFloat(apt.location.cityName === "Москва" ? "55.7558" : "43.2567");

      return {
        type: "Feature",
        properties: {
          id: apt.id,
          apartment: apt,
        },
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };
    });

    // Initialize supercluster
    superclusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });

    superclusterRef.current.load(points as any);

    // Initial update of cluster markers
    updateClusterMarkers();

    // Update clusters when the map moves
    map.on("moveend", updateClusterMarkers);
    map.on("zoom", updateClusterMarkers);

    // If there's a selected apartment, fly to it
    if (selectedApartment) {
      const lng =
        selectedApartment.location.longitude ||
        parseFloat(
          selectedApartment.location.cityName === "Москва"
            ? "37.6173"
            : "76.9286"
        );
      const lat =
        selectedApartment.location.latitude ||
        parseFloat(
          selectedApartment.location.cityName === "Москва"
            ? "55.7558"
            : "43.2567"
        );

      map.flyTo({
        center: [lng, lat],
        zoom: 14,
        essential: true,
      });
    }
    // Otherwise fit the map to show all markers
    else if (apartments.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      apartments.forEach((apt) => {
        const lng =
          apt.location.longitude ||
          parseFloat(
            apt.location.cityName === "Москва" ? "37.6173" : "76.9286"
          );
        const lat =
          apt.location.latitude ||
          parseFloat(
            apt.location.cityName === "Москва" ? "55.7558" : "43.2567"
          );
        bounds.extend([lng, lat]);
      });

      map.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
    }
  };

  // Function to update cluster markers
  const updateClusterMarkers = () => {
    if (!mapRef.current || !superclusterRef.current) return;

    const map = mapRef.current;
    const supercluster = superclusterRef.current;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Get current map bounds
    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());

    // Get clusters based on current bounds and zoom
    const clusters = supercluster.getClusters(
      [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ],
      zoom
    );

    // Create markers for clusters and points
    clusters.forEach((cluster) => {
      const [longitude, latitude] = cluster.geometry.coordinates;

      // If it's a cluster
      if (cluster.properties && cluster.properties.cluster) {
        const pointCount = cluster.properties.point_count;

        // Create cluster marker element
        const el = document.createElement("div");
        el.className = `cluster-marker ${
          pointCount > 10 ? "large" : pointCount > 5 ? "medium" : "small"
        }`;
        el.style.width = `${
          30 + (pointCount > 10 ? 20 : pointCount > 5 ? 10 : 0)
        }px`;
        el.style.height = `${
          30 + (pointCount > 10 ? 20 : pointCount > 5 ? 10 : 0)
        }px`;
        el.style.borderRadius = "50%";
        el.style.backgroundColor = "#1e40af";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "white";
        el.style.fontWeight = "bold";
        el.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
        el.textContent = pointCount.toString();

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Add click handler to zoom into cluster
        el.addEventListener("click", () => {
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.properties.cluster_id),
            17
          );

          map.flyTo({
            center: [longitude, latitude],
            zoom: expansionZoom + 0.5,
          });
        });

        markersRef.current.push(marker);
      }
      // If it's a single point
      else {
        // Extract apartment data from properties
        const apartmentData = cluster.properties.apartment;

        // Create marker element
        const el = document.createElement("div");
        el.className = "apartment-marker";
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50%";
        el.style.backgroundColor =
          selectedApartment?.id === apartmentData.id ? "#f97316" : "#1e40af";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";

        // Create marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([longitude, latitude])
          .addTo(map);

        // Create popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          maxWidth: "300px",
        }).setHTML(`
          <div style="padding: 10px;">
            <div style="font-weight: bold; margin-bottom: 5px;">${
              apartmentData.title
            }</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span style="font-size: 0.875rem; color: #6b7280;">
                ${apartmentData.location.address}
              </span>
            </div>
            <div style="font-weight: 600; color: #1e40af; font-size: 1.1rem;">
              ${apartmentData.price.toLocaleString()} ${apartmentData.currency}
            </div>
            <div style="display: flex; gap: 10px; margin-top: 5px;">
              <span style="font-size: 0.875rem; display: flex; align-items: center; gap: 3px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                ${apartmentData.rooms}
              </span>
              <span style="font-size: 0.875rem; display: flex; align-items: center; gap: 3px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                ${apartmentData.area} m²
              </span>
            </div>
          </div>
        `);

        // Show popup on hover
        el.addEventListener("mouseenter", () => {
          popup.setLngLat([longitude, latitude]).addTo(map);
        });

        el.addEventListener("mouseleave", () => {
          popup.remove();
        });

        // Handle click on marker
        el.addEventListener("click", () => {
          if (onMarkerClick) {
            onMarkerClick(apartmentData);
          }
        });

        markersRef.current.push(marker);
      }
    });
  };

  return (
    <div
      className={`h-[70vh] relative rounded-lg overflow-hidden ${className}`}
      ref={mapContainerRef}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/75 z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default Map;
