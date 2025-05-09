"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Home, 
  Calendar, 
  Users, 
  Building, 
  Share2, 
  Heart, 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight,
  Maximize,
  Maximize2
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClientTranslation } from "@/i18n/client";

import ApartmentFeaturesList from "./apartment-features-list";
import ApartmentInfoList from "./apartment-info-list";
import ContactSection from "./contact-section";
import InterestGroupSection from "./interest-group-section";
import ApartmentPhotoGallery from "./apartment-photo-gallery";
import ApartmentLocationMap from "./apartment-location-map";

export default function DesktopApartmentDetail({ apartment }: { apartment: any }) {
  const [activeTab, setActiveTab] = useState("information");
  const [isFavorite, setIsFavorite] = useState(false);
  const [locale, setLocale] = useState<"en" | "ru">("ru");
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const { t } = useClientTranslation(locale, "apartment");
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString() + " ₸";
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return t("common.notSpecified");
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("navigation.backToListings")}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-muted-foreground">
            <Share2 className="h-4 w-4 mr-2" />
            {t("actions.share")}
          </Button>
          
          <Button 
            variant={isFavorite ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className={isFavorite ? "bg-rose-100 text-rose-600 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" : "text-muted-foreground"}
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-rose-500 dark:fill-rose-400" : ""}`} />
            {isFavorite ? t("actions.inFavorites") : t("actions.addToFavorites")}
          </Button>
        </div>
      </div>
      
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-8">
        <div 
          className="h-[450px] rounded-lg overflow-hidden bg-muted relative cursor-pointer"
          onClick={() => document.getElementById('fullscreen-gallery-trigger')?.click()}
          data-gallery-open
        >
          <Image
            src={apartment.photos[0]?.url || "/images/placeholder.jpg"}
            alt={apartment.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 bg-background/60 hover:bg-background/80 text-foreground rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('fullscreen-gallery-trigger')?.click();
            }}
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4">
          {apartment.photos.slice(1, 5).map((photo: any, index: number) => (
            <div 
              key={index} 
              className="relative h-[218px] rounded-lg overflow-hidden bg-muted cursor-pointer"
              onClick={() => {
                setFullscreenIndex?.(index + 1);
                document.getElementById('fullscreen-gallery-trigger')?.click();
              }}
            >
              <Image
                src={photo.url}
                alt={`${t("gallery.photo")} ${index + 2}`}
                fill
                className="object-cover"
              />
              
              {index === 3 && apartment.photos.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <span className="font-semibold">+{apartment.photos.length - 5} {t("gallery.morePhotos")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* Left Column - Information */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{apartment.title}</h1>
          
          <div className="flex items-center text-muted-foreground mb-6">
            <MapPin className="h-4 w-4 mr-1 inline" />
            <span>
              {apartment.regionText}
              {apartment.districtText ? `, ${apartment.districtText}` : ''}
              {apartment.microDistrictText ? `, ${apartment.microDistrictText}` : ''}
              {apartment.address ? `, ${apartment.address}` : ''}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Home className="h-4 w-4 mr-2" />
              {apartment.quantityOfRooms} {t("features.rooms")}
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Maximize className="h-4 w-4 mr-2" />
              {apartment.areaOfTheApartment} {t("features.squareMeters")}
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Building className="h-4 w-4 mr-2" />
              {apartment.typeOfHousing === "APARTMENT" ? t("propertyType.apartment") : t("propertyType.house")}
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Users className="h-4 w-4 mr-2" />
              {apartment.numberOfPeopleAreYouAccommodating} {t("features.people")}
            </Badge>
            
            <Badge variant="secondary" className="py-1.5 px-3 font-normal text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              {t("features.availableFrom")} {formatDate(apartment.arriveDate)}
            </Badge>
          </div>
          
          <Tabs defaultValue="description" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="w-full border-b pb-0 mb-6">
              <TabsTrigger value="description" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                {t("tabs.description")}
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                {t("tabs.information")}
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                {t("tabs.features")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-0">
              <div className="text-foreground leading-relaxed">
                <p>{apartment.apartmentsInfo}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="info" className="mt-0">
              <ApartmentInfoList apartment={apartment} isDesktop={true} />
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <ApartmentFeaturesList apartment={apartment} isDesktop={true} />
            </TabsContent>
          </Tabs>
          <div className="space-y-4">
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <ApartmentLocationMap apartment={apartment} />
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {apartment.regionText}
                {apartment.districtText ? `, ${apartment.districtText}` : ''}
                {apartment.microDistrictText ? `, ${apartment.microDistrictText}` : ''}
                {apartment.address ? `, ${apartment.address}` : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Contact & Apply */}
        <div>
          {/* Price Card */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{formatPrice(apartment.cost)}</p>
                <p className="text-sm text-muted-foreground">/ {t("pricing.month")}</p>
              </div>
              
              {apartment.deposit > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground text-right">{t("pricing.deposit")}</p>
                  <p className="font-semibold text-foreground">{formatPrice(apartment.deposit)}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("pricing.utilities")}:</span>
                <span className="font-medium text-foreground">
                  {formatPrice(apartment.minAmountOfCommunalService)} - {formatPrice(apartment.maxAmountOfCommunalService)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("pricing.availableFrom")}:</span>
                <span className="font-medium text-foreground">{formatDate(apartment.arriveDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("pricing.leaseTerms")}:</span>
                <span className="font-medium text-foreground">{apartment.forALongTime ? t("leaseType.longTerm") : t("leaseType.shortTerm")}</span>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              <Button className="w-full">{t("actions.applyNow")}</Button>
              <Button variant="outline" className="w-full">{t("actions.contactOwner")}</Button>
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-6">
            <ContactSection apartment={apartment} isDesktop={true} />
          </div>
          
          {/* Interest Groups Section */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <InterestGroupSection apartment={apartment} isDesktop={true} />
          </div>
        </div>
      </div>
      
      {/* Hidden gallery component that will be shown when triggered */}
      <div className="hidden">
        <ApartmentPhotoGallery 
          photos={apartment.photos} 
          initialFullscreenIndex={fullscreenIndex} 
        />
      </div>
      
      {/* Hidden button to trigger the fullscreen gallery */}
      <button 
        id="fullscreen-gallery-trigger" 
        className="hidden"
        aria-label={t("gallery.openFullscreen")}
      />
    </div>
  );
}