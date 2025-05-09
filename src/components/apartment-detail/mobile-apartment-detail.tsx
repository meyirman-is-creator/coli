"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Home, Users, Maximize } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ApartmentFeaturesList from "./apartment-features-list";
import ApartmentInfoList from "./apartment-info-list";
import ContactSection from "./contact-section";
import InterestGroupSection from "./interest-group-section";
import ApartmentPhotoGallery from "./apartment-photo-gallery";
import ApartmentLocationMap from "./apartment-location-map";

export default function MobileApartmentDetail({ apartment }: { apartment: any }) {
  const [activeTab, setActiveTab] = useState("description");
  const scrollContainerRef = useRef(null);
  
  // Format price
  const formatPrice = (price: number) => {
    return price.toLocaleString() + " ₸";
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Photo Gallery Section */}
      <div className="relative w-full h-[280px] md:h-[350px] bg-gray-100">
        <ApartmentPhotoGallery photos={apartment.photos} />
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 -mt-6 rounded-t-3xl bg-white shadow-sm flex-grow">
        {/* Title & Price */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{apartment.title}</h1>
          <div className="flex items-baseline mb-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(apartment.cost)}</span>
            <span className="ml-1 text-sm text-gray-500">/ месяц</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
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
          <Badge variant="outline" className="bg-slate-50 py-1.5 px-3 font-normal">
            <Home className="h-3.5 w-3.5 mr-1.5" />
            {apartment.quantityOfRooms} комн.
          </Badge>
          <Badge variant="outline" className="bg-slate-50 py-1.5 px-3 font-normal">
            <Maximize className="h-3.5 w-3.5 mr-1.5" />
            {apartment.areaOfTheApartment} м²
          </Badge>
          <Badge variant="outline" className="bg-slate-50 py-1.5 px-3 font-normal">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            {apartment.numberOfPeopleAreYouAccommodating} чел.
          </Badge>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="description" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="features">Качества</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-0">
            <div className="mb-6 text-gray-700 text-sm leading-relaxed">
              <p>{apartment.apartmentsInfo}</p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-800">Финансовая информация</h3>
              
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-600 text-sm">Депозит:</span>
                <span className="font-medium text-gray-900">{formatPrice(apartment.deposit)}</span>
              </div>
              <Separator className="my-2.5" />
              
              <div className="flex justify-between mb-2.5">
                <span className="text-gray-600 text-sm">Коммунальные услуги:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(apartment.minAmountOfCommunalService)} - {formatPrice(apartment.maxAmountOfCommunalService)}
                </span>
              </div>
              <Separator className="my-2.5" />
              
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Доступно с:</span>
                <span className="font-medium text-gray-900">{formatDate(apartment.arriveDate)}</span>
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
          <div className="h-[240px] rounded-lg overflow-hidden border">
            <ApartmentLocationMap apartment={apartment} zoom={13} />
          </div>
          <div className="flex items-center text-sm text-gray-500">
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
        <div className="mb-8 bg-slate-50 rounded-lg p-4">
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