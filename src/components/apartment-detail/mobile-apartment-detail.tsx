"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Home, Users, Maximize } from "lucide-react";
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

export default function MobileApartmentDetail({ apartment }: { apartment: any }) {
  const [activeTab, setActiveTab] = useState("information");
  const scrollContainerRef = useRef(null);
  const [locale, setLocale] = useState<"en" | "ru">("ru");
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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Photo Gallery Section */}
      <div className="relative w-full h-[280px] md:h-[350px] bg-muted">
        <ApartmentPhotoGallery photos={apartment.photos} />
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 -mt-6 rounded-t-3xl bg-card shadow-sm flex-grow">
        {/* Title & Price */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-foreground mb-2">{apartment.title}</h1>
          <div className="flex items-baseline mb-2">
            <span className="text-xl font-bold text-foreground">{formatPrice(apartment.cost)}</span>
            <span className="ml-1 text-sm text-muted-foreground">/ {t("pricing.month")}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1 inline flex-shrink-0" />
            <span className="truncate">
              {apartment.regionText}
              {apartment.districtText ? `, ${apartment.districtText}` : ''}
              {apartment.microDistrictText ? `, ${apartment.microDistrictText}` : ''}
              {apartment.address ? `, ${apartment.address}` : ''}
            </span>
          </div>
        </div>
        
        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="bg-accent/30 py-1.5 px-3 font-normal">
            <Home className="h-3.5 w-3.5 mr-1.5" />
            {apartment.quantityOfRooms} {t("features.roomsShort")}
          </Badge>
          <Badge variant="outline" className="bg-accent/30 py-1.5 px-3 font-normal">
            <Maximize className="h-3.5 w-3.5 mr-1.5" />
            {apartment.areaOfTheApartment} {t("features.squareMetersShort")}
          </Badge>
          <Badge variant="outline" className="bg-accent/30 py-1.5 px-3 font-normal">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {apartment.numberOfPeopleAreYouAccommodating} {t("features.peopleShort")}
          </Badge>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="description">{t("tabs.description")}</TabsTrigger>
            <TabsTrigger value="info">{t("tabs.information")}</TabsTrigger>
            <TabsTrigger value="features">{t("tabs.features")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-0">
            <div className="mb-6 text-foreground text-sm leading-relaxed">
              <p>{apartment.apartmentsInfo}</p>
            </div>
            
            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-foreground">{t("sections.financialInfo")}</h3>
              
              <div className="flex justify-between mb-2.5">
                <span className="text-muted-foreground text-sm">{t("pricing.deposit")}:</span>
                <span className="font-medium text-foreground">{formatPrice(apartment.deposit)}</span>
              </div>
              <Separator className="my-2.5" />
              
              <div className="flex justify-between mb-2.5">
                <span className="text-muted-foreground text-sm">{t("pricing.utilities")}:</span>
                <span className="font-medium text-foreground">
                  {formatPrice(apartment.minAmountOfCommunalService)} - {formatPrice(apartment.maxAmountOfCommunalService)}
                </span>
              </div>
              <Separator className="my-2.5" />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">{t("pricing.availableFrom")}:</span>
                <span className="font-medium text-foreground">{formatDate(apartment.arriveDate)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            <ApartmentInfoList apartment={apartment} isDesktop={false} />
          </TabsContent>
          
          <TabsContent value="features" className="mt-0">
            <ApartmentFeaturesList apartment={apartment} isDesktop={false} />
          </TabsContent>
        </Tabs>
        <div className="space-y-4">
          <div className="h-[240px] rounded-lg overflow-hidden border border-border">
            <ApartmentLocationMap apartment={apartment} zoom={13} />
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-xs">
              {apartment.regionText}
              {apartment.districtText ? `, ${apartment.districtText}` : ''}
              {apartment.microDistrictText ? `, ${apartment.microDistrictText}` : ''}
              {apartment.address ? `, ${apartment.address}` : ''}
            </span>
          </div>
        </div>
        
        {/* Contact Section */}
        <div className="mb-8 bg-accent/10 rounded-lg p-4">
          <ContactSection apartment={apartment} isDesktop={false} />
        </div>
        
        {/* Interested People Section */}
        <div className="mb-8">
          <InterestGroupSection apartment={apartment} isDesktop={false} />
        </div>
      </div>
    </div>
  );
}