"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function ApartmentPhotoGallery({ photos }: { photos: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const photoUrls = photos?.map((photo: any) => photo.url) || [];
  
  // Handle navigation
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % photoUrls.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + photoUrls.length) % photoUrls.length);
  };
  
  // Handle swipe events for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: any) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: any) => {
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

  if (!photoUrls.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">Фотографии отсутствуют</p>
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
      >
        <div 
          ref={scrollRef}
          className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory touch-pan-x"
        >
          {photoUrls.map((url: string, index: number) => (
            <div 
              key={index}
              className="min-w-full h-full snap-center relative"
              onClick={() => openFullGallery(index)}
            >
              <Image
                src={url}
                alt={`Фото ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md z-10"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>
        
        {/* Dots indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {photoUrls.map((_, index: number) => (
            <button
              key={index}
              onClick={(e: any) => {
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
        <div className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
          {currentIndex + 1} / {photoUrls.length}
        </div>
      </div>
      
      {/* Fullscreen Gallery Dialog */}
      <Dialog open={showFullGallery} onOpenChange={setShowFullGallery}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black">
            <DialogTitle></DialogTitle>
          <div className="relative w-full h-[90vh]">
            <Image
              src={photoUrls[fullscreenIndex]}
              alt={`Фото ${fullscreenIndex + 1}`}
              fill
              className="object-contain"
            />
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50"
              onClick={() => setShowFullGallery(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50"
              onClick={() => setFullscreenIndex(prev => (prev - 1 + photoUrls.length) % photoUrls.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full bg-black/50"
              onClick={() => setFullscreenIndex(prev => (prev + 1) % photoUrls.length)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {fullscreenIndex + 1} / {photoUrls.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}