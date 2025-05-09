"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2, MinusCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useClientTranslation } from "@/i18n/client";

export default function ApartmentPhotoGallery({ photos, initialFullscreenIndex = 0 }: { photos: any[], initialFullscreenIndex?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(initialFullscreenIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const { t } = useClientTranslation(locale, "apartment");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const photoUrls = photos?.map((photo: any) => photo.url) || [];
  
  // Reset zoom and position when changing images
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [fullscreenIndex]);

  // Handle navigation
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % photoUrls.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + photoUrls.length) % photoUrls.length);
  };

  const nextFullscreenSlide = () => {
    setFullscreenIndex(prev => (prev + 1) % photoUrls.length);
  };
  
  const prevFullscreenSlide = () => {
    setFullscreenIndex(prev => (prev - 1 + photoUrls.length) % photoUrls.length);
  };
  
  // Handle swipe events for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide();
    }
    
    if (touchEnd - touchStart > 50) {
      // Swipe right
      prevSlide();
    }
  };
  
  // Open fullscreen gallery
  const openFullGallery = (index: number) => {
    setFullscreenIndex(index);
    setShowFullGallery(true);
  };
  
  // Handle the gallery trigger click from parent components
  useEffect(() => {
    const handleGalleryTriggerClick = () => {
      openFullGallery(fullscreenIndex);
    };
    
    const trigger = document.getElementById('fullscreen-gallery-trigger');
    if (trigger) {
      trigger.addEventListener('click', handleGalleryTriggerClick);
    }
    
    return () => {
      if (trigger) {
        trigger.removeEventListener('click', handleGalleryTriggerClick);
      }
    };
  }, [fullscreenIndex]);

  // Handle zoom
  const handleZoomIn = () => {
    if (zoom < 3) setZoom(prev => prev + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom(prev => prev - 0.5);
      // Reset position if zooming all the way out
      if (zoom - 0.5 <= 1) setPosition({ x: 0, y: 0 });
    }
  };

  // Handle drag to move around a zoomed image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleDialogClose = () => {
    setShowFullGallery(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // For mobile gallery
  useEffect(() => {
    if (scrollRef.current) {
      const scrollTo = currentIndex * scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  // Handle keyboard navigation in fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showFullGallery) return;
      
      switch (e.key) {
        case 'ArrowRight':
          nextFullscreenSlide();
          break;
        case 'ArrowLeft':
          prevFullscreenSlide();
          break;
        case 'Escape':
          handleDialogClose();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullGallery]);

  if (!photoUrls.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">{t("gallery.noPhotos")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Gallery */}
      <div 
        className="w-full h-full overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-gallery-open
        onClick={() => openFullGallery(currentIndex)}
      >
        <div 
          ref={scrollRef}
          className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory touch-pan-x"
        >
          {photoUrls.map((url: string, index: number) => (
            <div 
              key={index}
              className="min-w-full h-full snap-center relative"
            >
              <Image
                src={url}
                alt={`${t("gallery.photo")} ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 dark:bg-black/70 p-1.5 rounded-full shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 dark:bg-black/70 p-1.5 rounded-full shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
        
        {/* Fullscreen button */}
        <button 
          className="absolute right-4 top-4 bg-background/80 dark:bg-black/70 p-1.5 rounded-full shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            openFullGallery(currentIndex);
          }}
        >
          <Maximize2 className="h-5 w-5 text-foreground" />
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {photoUrls.map((_, index: number) => (
            <button
              key={index}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        
        {/* Counter indicator */}
        <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
          {currentIndex + 1} / {photoUrls.length}
        </div>
      </div>
      
      {/* Fullscreen Gallery Dialog */}
      <Dialog open={showFullGallery} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none" onPointerDown={(e) => e.stopPropagation()}>
            <DialogTitle></DialogTitle>
          <div 
            className="relative w-full h-[90vh] overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              ref={imageRef}
              style={{ 
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: dragging ? 'none' : 'transform 0.2s ease-out',
                cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default'
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <Image
                src={photoUrls[fullscreenIndex]}
                alt={`${t("gallery.photo")} ${fullscreenIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                quality={90}
              />
            </div>
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={handleDialogClose}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={prevFullscreenSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={nextFullscreenSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/70"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/70"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 text-center text-white px-3 py-1 rounded bg-black/50">
              {fullscreenIndex + 1} / {photoUrls.length} • {Math.round(zoom * 100)}%
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}